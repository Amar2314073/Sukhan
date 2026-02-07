const Poet = require('../models/poet');
const Poem = require('../models/poem');
const Stat = require('../models/stat');
const PoetOwnershipRequest = require('../models/poetOwnershipRequest')

// GET /poets - get all poets with pagination and filters
exports.getAllPoets = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = { isActive: true };
        
        if (req.query.era) {
            filter.era = req.query.era;
        }

        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: 'i' };
        }

        // Get poets with sorting
        const poets = await Poet.find(filter)
            .sort({ popularity: -1, _id: 1, name: 1 })
            .skip(skip)
            .limit(limit)
            .select('-isActive');

        // Get total count for pagination
        const total = await Poet.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            poets,
            pagination: {
                currentPage: page,
                totalPages,
                totalPoets: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Poets fetched successfully"
        });

    } catch (error) {
        console.error("Get all poets error:", error);
        res.status(500).json({ message: "Error fetching poets" });
    }
}

// GET /poets/:id - get poet by id with stats
exports.getPoetById = async (req, res) => {
    try {
        const poet = await Poet.findById(req.params.id);

        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }

        if (!poet.isActive) {
            return res.status(404).json({ message: "Poet not found" });
        }

        // Get poet statistics
        const poemCount = await Poem.countDocuments({ 
            poet: poet._id, 
            isActive: true 
        });

        const totalViews = await Poem.aggregate([
            { $match: { poet: poet._id, isActive: true } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);

        const poetStats = {
            poemCount,
            totalViews: totalViews[0]?.totalViews || 0
        };

        let hasPendingClaim = false;

        if (req.user) {
            const existing = await PoetOwnershipRequest.findOne({
                poet: poet._id,
                user: req.user._id,
                status: 'pending'
            });
            hasPendingClaim = !!existing;
        }


        res.status(200).json({
            poet: {
                ...poet.toObject(),
                stats: poetStats,
                hasPendingClaim
            },
            message: "Poet fetched successfully"
        });

    } catch (error) {
        console.error("Get poet by ID error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poet ID" });
        }
        
        res.status(500).json({ message: "Error fetching poet" });
    }
}

// GET /poets/:id/poems - get poems by poet with pagination
exports.getPoemsByPoet = async (req, res) => {
    try {
        const poetId = req.params.id;
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;
        // const skip = (page - 1) * limit;

        // Check if poet exists
        const poet = await Poet.findById(poetId);
        if (!poet || !poet.isActive) {
            return res.status(404).json({ message: "Poet not found" });
        }

        const poems = await Poem.find({ poet: poetId, isActive: true })
            .populate('category', 'name type')
            .sort({ popularity: -1, createdAt: -1 })
            // .skip(skip)
            // .limit(limit);

        // const total = await Poem.countDocuments({ poet: poetId, isActive: true });
        // const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            poet: {
                _id: poet._id,
                name: poet.name,
                era: poet.era
            },
            poems,
            /*pagination: {
                currentPage: page,
                totalPages,
                totalPoems: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },*/
            message: "Poems fetched successfully"
        });

    } catch (error) {
        console.error("Get poems by poet error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poet ID" });
        }
        
        res.status(500).json({ message: "Error fetching poems" });
    }
}

// GET /poets/era/:era - get poets by era
exports.getPoetsByEra = async (req, res) => {
    try {
        const { era } = req.params;
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 12;
        // const skip = (page - 1) * limit;

        // Validate era
        const validEras = ['Classical', 'Modern', 'Contemporary'];
        if (!validEras.includes(era)) {
            return res.status(400).json({ 
                message: "Invalid era. Must be: Classical, Modern, or Contemporary" 
            });
        }

        const poets = await Poet.find({ era, isActive: true })
            .sort({ popularity: -1, name: 1, _id: 1 })
            // .skip(skip)
            // .limit(limit);

        // const total = await Poet.countDocuments({ era, isActive: true });
        // const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            era,
            poets,
            // pagination: {
            //     currentPage: page,
            //     totalPages,
            //     totalPoets: total,
            //     hasNext: page < totalPages,
            //     hasPrev: page > 1
            // },
            message: "Poets fetched successfully"
        });

    } catch (error) {
        console.error("Get poets by era error:", error);
        res.status(500).json({ message: "Error fetching poets by era" });
    }
}

// GET /poets/search?q=... - search poets
exports.searchPoets = async (req, res) => {
    try {
        const query = req.query.q.trim();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: "Search query is required" });
        }

        const loose = query.split('').join('.*');

        // Build search filter
        const searchFilter = {
            isActive: true,
            $or: [
                { name: { $regex: loose, $options: 'i' } },
                { bio: { $regex: loose, $options: 'i' } }
            ]
        };

        // Additional era filter
        if (req.query.era) {
            searchFilter.era = req.query.era;
        }

        // Search poets
        const poets = await Poet.find(searchFilter)
            .sort({ popularity: -1, name: 1, _id: 1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Poet.countDocuments(searchFilter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            poets,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: poets.length > 0 ? "Search completed successfully" : "No poets found"
        });

    } catch (error) {
        console.error("Search poets error:", error);
        res.status(500).json({ message: "Error searching poets" });
    }
}

// get popular poets
exports.getPopularPoets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all active poets
    const poets = await Poet.find({ isActive: true })
      .skip(skip)
      .limit(limit)
      .lean(); // lean() makes it faster and returns plain JS objects

    if (!poets || poets.length === 0) {
      return res.status(404).json({ message: "No poets found" });
    }

    // For each poet, compute stats
    const poetsWithStats = await Promise.all(
      poets.map(async (poet) => {
        const poemCount = await Poem.countDocuments({
          poet: poet._id,
          isActive: true,
        });

        const totalViewsAgg = await Poem.aggregate([
          { $match: { poet: poet._id, isActive: true } },
          { $group: { _id: null, totalViews: { $sum: "$views" } } },
        ]);

        const totalViews = totalViewsAgg[0]?.totalViews || 0;

        return {
          ...poet,
          stats: {
            poemCount,
            totalViews,
          },
        };
      })
    );

    // Sort by popularity (based on totalViews)
    poetsWithStats.sort((a, b) => b.stats.totalViews - a.stats.totalViews);

    // Get total count for pagination
    const totalPoets = await Poet.countDocuments({ isActive: true });
    const totalPages = Math.ceil(totalPoets / limit);

    res.status(200).json({
      poets: poetsWithStats,
      pagination: {
        currentPage: page,
        totalPages,
        totalPoets,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: "Popular poets fetched successfully",
    });

  } catch (error) {
    console.error("Get popular poets error:", error);
    res.status(500).json({ message: "Error fetching popular poets" });
  }
};
