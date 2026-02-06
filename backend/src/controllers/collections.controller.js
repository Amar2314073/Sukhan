const Collection = require('../models/collection');
const Poem = require('../models/poem');
const User = require('../models/user');
const Stat = require('../models/stat');

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

// get trending collections 
exports.getTrendingCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ trending: true, isActive: true })
      .populate('category', 'name type')
      .populate('createdBy', 'name email')
      .populate({
        path: 'poems',
        populate: [
          { path: 'poet', select: 'name era' },
          { path: 'category', select: 'name type' }
        ]
      });

    if (!collections || collections.length === 0) {
      return res.status(404).json({ message: "No trending collections found" });
    }

    // Add stats to each collection
    const collectionsWithStats = collections.map((col) => {
      const poemCount = col.poems?.length || 0;
      const stats = { poemCount, totalPoems: poemCount };

      return {
        ...col.toObject(),
        stats
      };
    });

    res.status(200).json({
      collections: collectionsWithStats,
      message: "Trending collections fetched successfully",
    });

  } catch (error) {
    console.error("Get trending collections error:", error);
    res.status(500).json({ message: "Error fetching trending collections" });
  }
};
