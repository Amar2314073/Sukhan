const Collection = require('../models/collection');
const Poem = require('../models/poem');
const User = require('../models/user');

// GET /collections - get all collections with pagination
exports.getAllCollections = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { isActive: true };

        // Filter by category if provided
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Filter by featured if provided
        if (req.query.featured === 'true') {
            filter.featured = true;
        }

        // Get collections with population
        const collections = await Collection.find(filter)
            .populate('category', 'name type')
            .populate('createdBy', 'name')
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-isActive');

        // Get total count for pagination
        const total = await Collection.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            collections,
            pagination: {
                currentPage: page,
                totalPages,
                totalCollections: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Collections fetched successfully"
        });

    } catch (error) {
        console.error("Get all collections error:", error);
        res.status(500).json({ message: "Error fetching collections" });
    }
}

// GET /collections/featured - get featured collections
exports.getFeaturedCollections = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 6;

        const featuredCollections = await Collection.find({
            featured: true,
            isActive: true
        })
        .populate('category', 'name type')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(limit);

        res.status(200).json({
            collections: featuredCollections,
            message: "Featured collections fetched successfully"
        });

    } catch (error) {
        console.error("Get featured collections error:", error);
        res.status(500).json({ message: "Error fetching featured collections" });
    }
}

// GET /collections/:id - get collection by id with poems
exports.getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('category', 'name type')
            .populate('createdBy', 'name email')
            .populate({
                path: 'poems',
                populate: [
                    { path: 'poet', select: 'name era' },
                    { path: 'category', select: 'name type' }
                ]
            });

        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        if (!collection.isActive) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Get collection statistics
        const poemCount = collection.poems.length;

        const collectionStats = {
            poemCount,
            totalPoems: poemCount
        };

        res.status(200).json({
            collection: {
                ...collection.toObject(),
                stats: collectionStats
            },
            message: "Collection fetched successfully"
        });

    } catch (error) {
        console.error("Get collection by ID error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection ID" });
        }
        
        res.status(500).json({ message: "Error fetching collection" });
    }
}

// GET /collections/category/:categoryId - get collections by category
exports.getCollectionsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const collections = await Collection.find({
            category: categoryId,
            isActive: true
        })
        .populate('category', 'name type')
        .populate('createdBy', 'name')
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const total = await Collection.countDocuments({
            category: categoryId,
            isActive: true
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            collections,
            pagination: {
                currentPage: page,
                totalPages,
                totalCollections: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Collections fetched successfully"
        });

    } catch (error) {
        console.error("Get collections by category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        res.status(500).json({ message: "Error fetching collections" });
    }
}

// POST /collections - create collection (admin only)
exports.createCollection = async (req, res) => {
    try {
        const { name, description, category, featured, image } = req.body;
        const createdBy = req.user._id;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ 
                message: "Name and description are required" 
            });
        }

        // Check if collection already exists (case insensitive)
        const existingCollection = await Collection.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCollection) {
            return res.status(409).json({ 
                message: "Collection with this name already exists" 
            });
        }

        // Validate category if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        // Create collection
        const collection = await Collection.create({
            name: name.trim(),
            description: description.trim(),
            category: category || null,
            featured: featured || false,
            image: image || '',
            createdBy,
            poems: [] // Start with empty poems array
        });

        // Populate the created collection
        const populatedCollection = await Collection.findById(collection._id)
            .populate('category', 'name type')
            .populate('createdBy', 'name');

        res.status(201).json({
            collection: populatedCollection,
            message: "Collection created successfully"
        });

    } catch (error) {
        console.error("Create collection error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error creating collection" });
    }
}

// PUT /collections/:id - update collection (admin only)
exports.updateCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const { name, description, category, featured, image } = req.body;

        // Find existing collection
        const existingCollection = await Collection.findById(collectionId);
        if (!existingCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Check for duplicate name if name is being updated
        if (name && name !== existingCollection.name) {
            const duplicateCollection = await Collection.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: collectionId }
            });

            if (duplicateCollection) {
                return res.status(409).json({ 
                    message: "Another collection with this name already exists" 
                });
            }
        }

        // Validate category if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (category !== undefined) updateData.category = category;
        if (featured !== undefined) updateData.featured = featured;
        if (image !== undefined) updateData.image = image;

        // Update collection
        const updatedCollection = await Collection.findByIdAndUpdate(
            collectionId,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('category', 'name type')
        .populate('createdBy', 'name');

        res.status(200).json({
            collection: updatedCollection,
            message: "Collection updated successfully"
        });

    } catch (error) {
        console.error("Update collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection ID" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating collection" });
    }
}

// DELETE /collections/:id - delete collection (admin only)
exports.deleteCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;

        // Find collection
        const collection = await Collection.findById(collectionId);
        if (!collection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Soft delete (set isActive to false)
        collection.isActive = false;
        await collection.save();

        res.status(200).json({
            message: "Collection deleted successfully"
        });

    } catch (error) {
        console.error("Delete collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection ID" });
        }
        
        res.status(500).json({ message: "Error deleting collection" });
    }
}

// POST /collections/:id/poems - add poem to collection (admin only)
exports.addPoemToCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const { poemId } = req.body;

        if (!poemId) {
            return res.status(400).json({ message: "Poem ID is required" });
        }

        // Check if collection exists
        const collection = await Collection.findById(collectionId);
        if (!collection || !collection.isActive) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Check if poem exists
        const poem = await Poem.findById(poemId);
        if (!poem || !poem.isActive) {
            return res.status(404).json({ message: "Poem not found" });
        }

        // Check if poem already in collection
        if (collection.poems.includes(poemId)) {
            return res.status(409).json({ message: "Poem already in collection" });
        }

        // Add poem to collection
        collection.poems.push(poemId);
        await collection.save();

        // Populate the updated collection
        const updatedCollection = await Collection.findById(collectionId)
            .populate('category', 'name type')
            .populate('createdBy', 'name')
            .populate({
                path: 'poems',
                populate: [
                    { path: 'poet', select: 'name era' },
                    { path: 'category', select: 'name type' }
                ]
            });

        res.status(200).json({
            collection: updatedCollection,
            message: "Poem added to collection successfully"
        });

    } catch (error) {
        console.error("Add poem to collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection or poem ID" });
        }
        
        res.status(500).json({ message: "Error adding poem to collection" });
    }
}

// DELETE /collections/:id/poems/:poemId - remove poem from collection (admin only)
exports.removePoemFromCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const poemId = req.params.poemId;

        // Check if collection exists
        const collection = await Collection.findById(collectionId);
        if (!collection || !collection.isActive) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Check if poem is in collection
        if (!collection.poems.includes(poemId)) {
            return res.status(404).json({ message: "Poem not found in collection" });
        }

        // Remove poem from collection
        collection.poems = collection.poems.filter(
            poem => poem.toString() !== poemId
        );
        await collection.save();

        // Populate the updated collection
        const updatedCollection = await Collection.findById(collectionId)
            .populate('category', 'name type')
            .populate('createdBy', 'name')
            .populate({
                path: 'poems',
                populate: [
                    { path: 'poet', select: 'name era' },
                    { path: 'category', select: 'name type' }
                ]
            });

        res.status(200).json({
            collection: updatedCollection,
            message: "Poem removed from collection successfully"
        });

    } catch (error) {
        console.error("Remove poem from collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection or poem ID" });
        }
        
        res.status(500).json({ message: "Error removing poem from collection" });
    }
}

// GET /collections/search?q=... - search collections
exports.searchCollections = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Build search filter
        const searchFilter = {
            isActive: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        // Additional filters
        if (req.query.category) {
            searchFilter.category = req.query.category;
        }

        if (req.query.featured === 'true') {
            searchFilter.featured = true;
        }

        // Search collections
        const collections = await Collection.find(searchFilter)
            .populate('category', 'name type')
            .populate('createdBy', 'name')
            .sort({ featured: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Collection.countDocuments(searchFilter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            collections,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: collections.length > 0 ? "Search completed successfully" : "No collections found"
        });

    } catch (error) {
        console.error("Search collections error:", error);
        res.status(500).json({ message: "Error searching collections" });
    }
}

// GET /collections/stats/overview - get collections statistics
exports.getCollectionsStats = async (req, res) => {
    try {
        // Get total collections count
        const totalCollections = await Collection.countDocuments({ isActive: true });

        // Get featured collections count
        const featuredCollections = await Collection.countDocuments({
            featured: true,
            isActive: true
        });

        // Get collections with most poems
        const popularCollections = await Collection.find({ isActive: true })
            .populate('category', 'name')
            .populate('createdBy', 'name')
            .sort({ poems: -1 })
            .limit(5)
            .select('name poems length category featured');

        // Format popular collections
        const formattedPopular = popularCollections.map(collection => ({
            _id: collection._id,
            name: collection.name,
            poemCount: collection.poems.length,
            category: collection.category,
            featured: collection.featured
        }));

        res.status(200).json({
            stats: {
                totalCollections,
                featuredCollections,
                popularCollections: formattedPopular
            },
            message: "Collections statistics fetched successfully"
        });

    } catch (error) {
        console.error("Get collections stats error:", error);
        res.status(500).json({ message: "Error fetching collections statistics" });
    }
}