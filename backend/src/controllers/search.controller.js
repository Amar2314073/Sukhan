const Category = require("../models/category");
const Collection = require("../models/collection");
const Poem = require("../models/poem");
const Poet = require("../models/poet");
const Book = require('../models/book');


exports.searchPoets = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const matchStage = {
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ]
    };
    

    if (req.query.era) {
      matchStage.era = req.query.era;
    }

    const poets = await Poet.aggregate([
      { $match: matchStage },



      // final ordering
      {
        $sort: {
          popularity: -1,
          name: 1
        }
      },

      { $skip: skip },
      { $limit: limit }
    ]);

    const total = await Poet.countDocuments(matchStage);

    res.status(200).json({
      poets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      message: poets.length
        ? "Search completed successfully"
        : "No poets found"
    });

  } catch (error) {
    console.error("Search poets error:", error);
    res.status(500).json({ message: "Error searching poets" });
  }
};

exports.searchPoems = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }


    const searchFilter = {
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { 'content.hindi': { $regex: query, $options: 'i' } },
        { 'content.roman': { $regex: query, $options: 'i' } }
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

exports.searchCategories = async (req, res) => {
    try {
        const query = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
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

        // Additional type filter
        if (req.query.type) {
            searchFilter.type = req.query.type;
        }

        // Search categories
        const categories = await Category.find(searchFilter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Category.countDocuments(searchFilter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            categories,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            message: categories.length > 0 ? "Search completed successfully" : "No categories found"
        });

    } catch (error) {
        console.error("Search categories error:", error);
        res.status(500).json({ message: "Error searching categories" });
    }
}

exports.searchBooks = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchFilter = {
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { language: { $regex: query, $options: 'i' } }
      ]
    };

    const books = await Book.find(searchFilter)
      .sort({ clicks: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(searchFilter);

    res.status(200).json({
      books,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      message: books.length
        ? "Books search completed successfully"
        : "No books found"
    });

  } catch (error) {
    console.error("Search books error:", error);
    res.status(500).json({ message: "Error searching books" });
  }
};
