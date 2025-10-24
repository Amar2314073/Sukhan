const UserCollection = require('../models/userCollection');
const Poem = require('../models/poem');
const User = require('../models/user');

// GET /user-collections - get user's collections with pagination
exports.getUserCollections = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { user: userId };

        // Filter by type if provided
        if (req.query.type && ['sher', 'ghazal', 'nazm', 'mixed'].includes(req.query.type)) {
            filter.type = req.query.type;
        }

        // Filter by public/private if provided
        if (req.query.isPublic === 'true') {
            filter.isPublic = true;
        } else if (req.query.isPublic === 'false') {
            filter.isPublic = false;
        }

        // Get user collections with poems count
        const userCollections = await UserCollection.find(filter)
            .populate({
                path: 'poems',
                select: 'title poet',
                populate: { path: 'poet', select: 'name' },
                options: { limit: 3 } // Show only first 3 poems for preview
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format response with poem counts
        const collectionsWithStats = userCollections.map(collection => ({
            ...collection.toObject(),
            poemCount: collection.poems.length,
            poems: collection.poems.slice(0, 3) // Preview only
        }));

        // Get total count for pagination
        const total = await UserCollection.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            collections: collectionsWithStats,
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
        console.error("Get user collections error:", error);
        res.status(500).json({ message: "Error fetching collections" });
    }
}

// POST /user-collections - create new collection (user only)
exports.createUserCollection = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, description, type, isPublic } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ 
                message: "Collection name is required" 
            });
        }

        // Validate type
        const validTypes = ['sher', 'ghazal', 'nazm', 'mixed'];
        if (type && !validTypes.includes(type)) {
            return res.status(400).json({ 
                message: "Invalid type. Must be: sher, ghazal, nazm, or mixed" 
            });
        }

        // Check if collection already exists for this user (case insensitive)
        const existingCollection = await UserCollection.findOne({ 
            user: userId,
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCollection) {
            return res.status(409).json({ 
                message: "You already have a collection with this name" 
            });
        }

        // Create collection
        const userCollection = await UserCollection.create({
            name: name.trim(),
            description: description?.trim() || '',
            user: userId,
            type: type || 'mixed',
            isPublic: isPublic || false,
            poems: [],
            isDefault: false
        });

        // Update user's collections created count
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.collectionsCreated': 1 }
        });

        // Populate the created collection
        const populatedCollection = await UserCollection.findById(userCollection._id)
            .populate({
                path: 'poems',
                select: 'title poet',
                populate: { path: 'poet', select: 'name' }
            });

        res.status(201).json({
            collection: populatedCollection,
            message: "Collection created successfully"
        });

    } catch (error) {
        console.error("Create user collection error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error creating collection" });
    }
}

// GET /user-collections/:id - get user collection by id with poems
exports.getUserCollectionById = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const userId = req.user._id;

        const userCollection = await UserCollection.findOne({
            _id: collectionId,
            user: userId
        }).populate({
            path: 'poems',
            populate: [
                { path: 'poet', select: 'name era' },
                { path: 'category', select: 'name type' }
            ]
        });

        if (!userCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Get collection statistics
        const collectionStats = {
            poemCount: userCollection.poems.length,
            totalPoems: userCollection.poems.length
        };

        res.status(200).json({
            collection: {
                ...userCollection.toObject(),
                stats: collectionStats
            },
            message: "Collection fetched successfully"
        });

    } catch (error) {
        console.error("Get user collection by ID error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection ID" });
        }
        
        res.status(500).json({ message: "Error fetching collection" });
    }
}

// PUT /user-collections/:id - update user collection (user only)
exports.updateUserCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const userId = req.user._id;
        const { name, description, type, isPublic } = req.body;

        // Find existing collection and verify ownership
        const existingCollection = await UserCollection.findOne({
            _id: collectionId,
            user: userId
        });

        if (!existingCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Prevent updating default collections
        if (existingCollection.isDefault) {
            return res.status(400).json({ 
                message: "Cannot update default collections" 
            });
        }

        // Validate type if provided
        if (type) {
            const validTypes = ['sher', 'ghazal', 'nazm', 'mixed'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ 
                    message: "Invalid type. Must be: sher, ghazal, nazm, or mixed" 
                });
            }
        }

        // Check for duplicate name if name is being updated
        if (name && name !== existingCollection.name) {
            const duplicateCollection = await UserCollection.findOne({ 
                user: userId,
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: collectionId }
            });

            if (duplicateCollection) {
                return res.status(409).json({ 
                    message: "You already have another collection with this name" 
                });
            }
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (type) updateData.type = type;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        // Update collection
        const updatedCollection = await UserCollection.findByIdAndUpdate(
            collectionId,
            updateData,
            { new: true, runValidators: true }
        ).populate({
            path: 'poems',
            select: 'title poet',
            populate: { path: 'poet', select: 'name' }
        });

        res.status(200).json({
            collection: updatedCollection,
            message: "Collection updated successfully"
        });

    } catch (error) {
        console.error("Update user collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection ID" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating collection" });
    }
}

// DELETE /user-collections/:id - delete user collection (user only)
exports.deleteUserCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const userId = req.user._id;

        // Find collection and verify ownership
        const userCollection = await UserCollection.findOne({
            _id: collectionId,
            user: userId
        });

        if (!userCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Prevent deleting default collections
        if (userCollection.isDefault) {
            return res.status(400).json({ 
                message: "Cannot delete default collections" 
            });
        }

        // Delete collection
        await UserCollection.findByIdAndDelete(collectionId);

        // Update user's collections created count
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.collectionsCreated': -1 }
        });

        res.status(200).json({
            message: "Collection deleted successfully"
        });

    } catch (error) {
        console.error("Delete user collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection ID" });
        }
        
        res.status(500).json({ message: "Error deleting collection" });
    }
}

// POST /user-collections/:id/poems - add poem to user collection
exports.addPoemToUserCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const userId = req.user._id;
        const { poemId } = req.body;

        if (!poemId) {
            return res.status(400).json({ message: "Poem ID is required" });
        }

        // Check if collection exists and user owns it
        const userCollection = await UserCollection.findOne({
            _id: collectionId,
            user: userId
        });

        if (!userCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Check if poem exists
        const poem = await Poem.findById(poemId);
        if (!poem || !poem.isActive) {
            return res.status(404).json({ message: "Poem not found" });
        }

        // Check if poem already in collection
        if (userCollection.poems.includes(poemId)) {
            return res.status(409).json({ message: "Poem already in collection" });
        }

        // Auto-detect collection type if it's mixed and this is the first poem
        if (userCollection.type === 'mixed' && userCollection.poems.length === 0) {
            const poemType = poem.category?.type || 'mixed';
            if (poemType !== 'mixed') {
                userCollection.type = poemType;
            }
        }

        // Add poem to collection
        userCollection.poems.push(poemId);
        await userCollection.save();

        // Populate the updated collection
        const updatedCollection = await UserCollection.findById(collectionId)
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
        console.error("Add poem to user collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection or poem ID" });
        }
        
        res.status(500).json({ message: "Error adding poem to collection" });
    }
}

// DELETE /user-collections/:id/poems/:poemId - remove poem from user collection
exports.removePoemFromUserCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const userId = req.user._id;
        const poemId = req.params.poemId;

        // Check if collection exists and user owns it
        const userCollection = await UserCollection.findOne({
            _id: collectionId,
            user: userId
        });

        if (!userCollection) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Check if poem is in collection
        if (!userCollection.poems.includes(poemId)) {
            return res.status(404).json({ message: "Poem not found in collection" });
        }

        // Remove poem from collection
        userCollection.poems = userCollection.poems.filter(
            poem => poem.toString() !== poemId
        );

        // Reset to mixed type if collection becomes empty
        if (userCollection.poems.length === 0 && userCollection.isDefault === false) {
            userCollection.type = 'mixed';
        }

        await userCollection.save();

        // Populate the updated collection
        const updatedCollection = await UserCollection.findById(collectionId)
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
        console.error("Remove poem from user collection error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid collection or poem ID" });
        }
        
        res.status(500).json({ message: "Error removing poem from collection" });
    }
}

// GET /user-collections/search?q=... - search user's collections
exports.searchUserCollections = async (req, res) => {
    try {
        const userId = req.user._id;
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Build search filter
        const searchFilter = {
            user: userId,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        };

        // Additional type filter
        if (req.query.type) {
            searchFilter.type = req.query.type;
        }

        // Search collections
        const collections = await UserCollection.find(searchFilter)
            .populate({
                path: 'poems',
                select: 'title poet',
                populate: { path: 'poet', select: 'name' },
                options: { limit: 3 }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Format response with poem counts
        const collectionsWithStats = collections.map(collection => ({
            ...collection.toObject(),
            poemCount: collection.poems.length,
            poems: collection.poems.slice(0, 3)
        }));

        // Get total count
        const total = await UserCollection.countDocuments(searchFilter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            collections: collectionsWithStats,
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
        console.error("Search user collections error:", error);
        res.status(500).json({ message: "Error searching collections" });
    }
}

// GET /user-collections/stats/overview - get user's collection statistics
exports.getUserCollectionsStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get total collections count
        const totalCollections = await UserCollection.countDocuments({ user: userId });

        // Get counts by type
        const typeStats = await UserCollection.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalPoems: { $sum: { $size: '$poems' } }
                }
            }
        ]);

        // Get public collections count
        const publicCollections = await UserCollection.countDocuments({
            user: userId,
            isPublic: true
        });

        // Get collections with most poems
        const popularCollections = await UserCollection.find({ user: userId })
            .sort({ poems: -1 })
            .limit(5)
            .select('name poems length type isPublic');

        // Format type stats
        const formattedTypeStats = {
            total: 0,
            sher: { collections: 0, poems: 0 },
            ghazal: { collections: 0, poems: 0 },
            nazm: { collections: 0, poems: 0 },
            mixed: { collections: 0, poems: 0 }
        };

        typeStats.forEach(stat => {
            if (formattedTypeStats[stat._id]) {
                formattedTypeStats[stat._id].collections = stat.count;
                formattedTypeStats[stat._id].poems = stat.totalPoems;
                formattedTypeStats.total += stat.count;
            }
        });

        // Format popular collections
        const formattedPopular = popularCollections.map(collection => ({
            _id: collection._id,
            name: collection.name,
            poemCount: collection.poems.length,
            type: collection.type,
            isPublic: collection.isPublic
        }));

        res.status(200).json({
            stats: {
                totalCollections,
                publicCollections,
                typeStats: formattedTypeStats,
                popularCollections: formattedPopular
            },
            message: "Collection statistics fetched successfully"
        });

    } catch (error) {
        console.error("Get user collections stats error:", error);
        res.status(500).json({ message: "Error fetching collection statistics" });
    }
}

// POST /user-collections/initialize-defaults - create default collections for user
exports.initializeDefaultCollections = async (req, res) => {
    try {
        const userId = req.user._id;

        // Check if user already has default collections
        const existingDefaults = await UserCollection.countDocuments({
            user: userId,
            isDefault: true
        });

        if (existingDefaults > 0) {
            return res.status(409).json({ 
                message: "Default collections already exist" 
            });
        }

        // Create default collections
        const defaultCollections = [
            {
                name: "My Favorite Sher",
                description: "Automatically saved sher from your favorites",
                user: userId,
                type: "sher",
                isPublic: false,
                isDefault: true,
                poems: []
            },
            {
                name: "My Favorite Ghazals", 
                description: "Automatically saved ghazals from your favorites",
                user: userId,
                type: "ghazal",
                isPublic: false,
                isDefault: true,
                poems: []
            },
            {
                name: "My Favorite Nazms",
                description: "Automatically saved nazms from your favorites", 
                user: userId,
                type: "nazm",
                isPublic: false,
                isDefault: true,
                poems: []
            }
        ];

        await UserCollection.insertMany(defaultCollections);

        // Update user's collections count
        await User.findByIdAndUpdate(userId, {
            $inc: { 'stats.collectionsCreated': 3 }
        });

        res.status(201).json({
            message: "Default collections created successfully"
        });

    } catch (error) {
        console.error("Initialize default collections error:", error);
        res.status(500).json({ message: "Error creating default collections" });
    }
}