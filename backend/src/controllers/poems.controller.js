const Poem = require('../models/poem');
const Poet = require('../models/poet');
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

      // 1️⃣ Find matching poets
      const poets = await Poet.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');

      poetIds = poets.map(p => p._id);

      // 2️⃣ Apply OR condition
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'content.hindi': { $regex: search, $options: 'i' } },
        { 'content.roman': { $regex: search, $options: 'i' } },
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

// POST /poems - create poem (admin only)
exports.createPoem = async (req, res) => {
    try {
        const { title, content, poet, category, tags } = req.body;

        // Validate required fields
        if (!title || !content || !poet || !category) {
            return res.status(400).json({ message: "Title, content, poet and category are required" });
        }

        // Check if poet exists
        const poetExists = await Poet.findById(poet);
        if (!poetExists) {
            return res.status(404).json({ message: "Poet not found" });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Create poem
        const poem = await Poem.create({
            title,
            content: {
                hindi: content.hindi || '',
                roman: content.roman || ''
            },
            poet,
            category,
            tags: tags || []
        });

        // Populate the created poem
        const populatedPoem = await Poem.findById(poem._id)
            .populate('poet', 'name era')
            .populate('category', 'name type');

        res.status(201).json({
            poem: populatedPoem,
            message: "Poem created successfully"
        });

    } catch (error) {
        console.error("Create poem error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error creating poem" });
    }
}

// PUT /poems/:id - update poem (admin only)
exports.updatePoem = async (req, res) => {
    try {
        const { title, content, poet, category, tags } = req.body;
        const poemId = req.params.id;

        // Find existing poem
        const existingPoem = await Poem.findById(poemId);
        if (!existingPoem) {
            return res.status(404).json({ message: "Poem not found" });
        }

        // Check if poet exists (if provided)
        if (poet) {
            const poetExists = await Poet.findById(poet);
            if (!poetExists) {
                return res.status(404).json({ message: "Poet not found" });
            }
        }

        // Check if category exists (if provided)
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        // Prepare update object
        const updateData = {};
        if (title) updateData.title = title;
        if (poet) updateData.poet = poet;
        if (category) updateData.category = category;
        if (tags) updateData.tags = tags;

        // Handle content updates
        if (content) {
            updateData.content = {
                hindi: content.hindi || existingPoem.content.hindi,
                roman: content.roman || existingPoem.content.roman
            };
        }

        // Update poem
        const updatedPoem = await Poem.findByIdAndUpdate(
            poemId,
            updateData,
            { new: true, runValidators: true }
        ).populate('poet', 'name era').populate('category', 'name type');

        res.status(200).json({
            poem: updatedPoem,
            message: "Poem updated successfully"
        });

    } catch (error) {
        console.error("Update poem error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poem ID" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating poem" });
    }
}

// DELETE /poems/:id - delete poem (admin only)
exports.deletePoem = async (req, res) => {
    try {
        const poemId = req.params.id;

        // Find poem
        const poem = await Poem.findById(poemId);
        if (!poem) {
            return res.status(404).json({ message: "Poem not found" });
        }

        // Soft delete (set isActive to false)
        poem.isActive = false;
        await poem.save();

        // Alternatively, you can hard delete with:
        // await Poem.findByIdAndDelete(poemId);

        res.status(200).json({
            message: "Poem deleted successfully"
        });

    } catch (error) {
        console.error("Delete poem error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poem ID" });
        }
        
        res.status(500).json({ message: "Error deleting poem" });
    }
}

// GET /poems/search?q=... - search poems
exports.searchPoem = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === '') {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Build search filter
        const searchFilter = {
            isActive: true,
            $text: { $search: query }
        };

        // Additional filters
        if (req.query.poet) {
            searchFilter.poet = req.query.poet;
        }
        
        if (req.query.category) {
            searchFilter.category = req.query.category;
        }

        // Search poems with text index
        const poems = await Poem.find(searchFilter)
            .populate('poet', 'name era')
            .populate('category', 'name type')
            .sort({ score: { $meta: "textScore" } })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Poem.countDocuments(searchFilter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            poems,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: poems.length > 0 ? "Search completed successfully" : "No poems found"
        });

    } catch (error) {
        console.error("Search poem error:", error);
        res.status(500).json({ message: "Error searching poems" });
    }
}

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

