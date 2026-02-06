const Poem = require('../models/poem');
const Poet = require('../models/poet');
const Stat = require('../models/stat');
const Category = require('../models/category');

// GET /poems - get all poems with pagination and filters
exports.getAllPoems = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 12;
    const skip = (page - 1) * limit;

    const { category, q } = req.query;

    const filter = { isActive: true };

    /* ===== CATEGORY FILTER ===== */
    if (category) filter.category = category;

    let poetIds = [];

    /* ===== POET NAME SEARCH ===== */
    if (q && q.trim()) {
      const search = q.trim();
      const loose = search.split('').join('.*');

      const poets = await Poet.find({
        name: { $regex: loose, $options: 'i' }
      }).select('_id');

      poetIds = poets.map(p => p._id);

      filter.$or = [
        { title: { $regex: loose, $options: 'i' } },
        { 'content.hindi': { $regex: loose, $options: 'i' } },
        { 'content.roman': { $regex: loose, $options: 'i' } },
        ...(poetIds.length ? [{ poet: { $in: poetIds } }] : [])
      ];
    }

    const poems = await Poem.find(filter)
      .populate('poet', 'name era')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Poem.countDocuments(filter);

    res.json({
      poems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Admin poems error' });
  }
};


// GET /poems/:id - get poem by id
exports.getPoemById = async (req, res) => {
    try {
        const poem = await Poem.findById(req.params.id)
            .populate('poet', 'name era bio birthYear deathYear image')
            .populate('category', 'name type');

        if (!poem) {
            return res.status(404).json({ message: "Poem not found" });
        }

        if (!poem.isActive) {
            return res.status(404).json({ message: "Poem not found" });
        }

        // Increment views
        poem.views += 1;
        await poem.save();

        res.status(200).json({
            poem,
            message: "Poem fetched successfully"
        });

    } catch (error) {
        console.error("Get poem by ID error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poem ID" });
        }
        
        res.status(500).json({ message: "Error fetching poem" });
    }
}

// GET /poems/search?q=... - search poems
exports.searchPoem = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const loose = query.split('').join('.*'); 
    // galib → g.*a.*l.*i.*b

    const searchFilter = {
      isActive: true,
      $or: [
        { title: { $regex: loose, $options: 'i' } },
        { 'content.hindi': { $regex: loose, $options: 'i' } },
        { 'content.roman': { $regex: loose, $options: 'i' } }
      ]
    };

    if (req.query.poet) {
      searchFilter.poet = req.query.poet;
    }

    if (req.query.category) {
      searchFilter.category = req.query.category;
    }

    const poems = await Poem.find(searchFilter)
      .populate('poet', 'name era')
      .populate('category', 'name type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Poem.countDocuments(searchFilter);

    res.json({
      poems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Search poem error:", error);
    res.status(500).json({ message: "Error searching poems" });
  }
};


// GET /poems/poet/:poetId - get poems by poet
exports.getPoemsByPoet = async (req, res) => {
    try {
        const poetId = req.params.poetId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if poet exists
        const poet = await Poet.findById(poetId);
        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }

        const poems = await Poem.find({ poet: poetId, isActive: true })
            .populate('category', 'name type')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Poem.countDocuments({ poet: poetId, isActive: true });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            poet,
            poems,
            pagination: {
                currentPage: page,
                totalPages,
                totalPoems: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
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

// GET /poems/category/:categoryId - get poems by category
exports.getPoemsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        const poems = await Poem.find({ category: categoryId, isActive: true })
            .populate('poet', 'name era')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Poem.countDocuments({ category: categoryId, isActive: true });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            category,
            poems,
            pagination: {
                currentPage: page,
                totalPages,
                totalPoems: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: "Poems fetched successfully"
        });

    } catch (error) {
        console.error("Get poems by category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        res.status(500).json({ message: "Error fetching poems" });
    }
}

// get featured poems
exports.getFeaturedPoems = async (req, res) => {
  try {
    const poems = await Poem.find({ featured: true, isActive: true })
      .populate('poet', 'name era bio birthYear deathYear image')
      .populate('category', 'name type');

    if (!poems || poems.length === 0) {
      return res.status(404).json({ message: "No featured poems found" });
    }

    res.status(200).json({
      poems,
      message: "Featured poems fetched successfully",
    });

  } catch (error) {
    console.error("Get featured poems error:", error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid poem ID" });
    }

    res.status(500).json({ message: "Error fetching featured poems" });
  }
};

