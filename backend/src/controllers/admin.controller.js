const Poet = require('../models/poet');
const Poem = require('../models/poem');
const User = require('../models/user');
const Category = require('../models/category');
const Collection = require('../models/collection');
const Stat = require('../models/stat');
const Book = require('../models/book');
const PoetOwnershipRequest = require('../models/poetOwnershipRequest');
const mongoose = require('mongoose');
const Payment = require('../models/payment');
const razorpayService = require('../services/razorpay.service');

/* -------- DASHBOARD -------- */
exports.dashboard = async (req, res) => {
  try {
    const stats = await Stat.findById('GLOBAL_STATS');

    if (!stats) {
      return res.status(404).json({
        message: 'Stats not found. Please sync stats.'
      });
    }

    const pendingOwnershipRequests = await PoetOwnershipRequest.countDocuments({status: 'pending'});

    res.json({
      poets: stats.poets,
      poems: stats.poems,
      collections: stats.collections,
      users: stats.users || 0,
      books: stats.books,
      poetOwners: stats.poetOwners,
      languages: stats.languages,
      era: stats.era,
      pendingOwnershipRequests
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error loading dashboard data' });
  }
};


exports.getPaymentStats = async (req, res) => {
  try {
    const { from, to, purpose } = req.query;

    const match = {};

    if (purpose) {
      match.purpose = purpose;
    }

    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const stats = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0]
            }
          },
          refundedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'refunded'] }, '$amount', 0]
            }
          },
          paidCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, 1, 0]
            }
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
            }
          },
          refundedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalPayments: 0,
      totalAmount: 0,
      paidAmount: 0,
      refundedAmount: 0,
      paidCount: 0,
      failedCount: 0,
      refundedCount: 0
    };

    return res.status(200).json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error('Payment stats error:', error);
    return res.status(500).json({ message: 'Failed to load payment stats' });
  }
};



/* -------- POETS -------- */


// GET /admin/poets/search?q=mir
exports.searchPoets = async (req, res) => {
  try {
    const { q = '' } = req.query;

    if (!q.trim()) {
      return res.json({ poets: [] });
    }

    const poets = await Poet.find({
      name: { $regex: q, $options: 'i' }
    })
      .select('name')
      .limit(10)
      .sort({ name: 1 });

    res.status(200).json({ poets });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Poet search failed' });
  }
};

// POST /poets - create poet (admin only)
exports.createPoet = async (req, res) => {
    try {
        const { name, bio, era, birthYear, deathYear, country, image } = req.body;

        // Validate required fields
        if (!name || !bio || !era || !country) {
            return res.status(400).json({ 
                message: "Name, bio, country and era are required" 
            });
        }

        // Validate era
        const validEras = ['Classical', 'Modern', 'Contemporary'];
        if (!validEras.includes(era)) {
            return res.status(400).json({ 
                message: "Invalid era. Must be: Classical, Modern, or Contemporary" 
            });
        }

        // Check if poet already exists (case insensitive)
        const existingPoet = await Poet.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingPoet) {
            return res.status(409).json({ 
                message: "Poet with this name already exists" 
            });
        }

        // Create poet
        const poet = await Poet.create({
            name: name.trim(),
            bio: bio.trim(),
            era,
            country: country.trim(),
            birthYear: birthYear || null,
            deathYear: deathYear || null,
            image: image || ''
        });

        await Stat.findByIdAndUpdate(
            'GLOBAL_STATS',
            { $inc: { poets: 1 } },
            { upsert: true }
        );

        res.status(201).json({
            poet,
            message: "Poet created successfully"
        });

    } catch (error) {
        console.error("Create poet error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error creating poet" });
    }
}

// PUT /poets/:id - update poet (admin only)
exports.updatePoet = async (req, res) => {
    try {
        const poetId = req.params.id;
        const { name, bio, era, country, birthYear, deathYear, image } = req.body;

        // Find existing poet
        const existingPoet = await Poet.findById(poetId);
        if (!existingPoet) {
            return res.status(404).json({ message: "Poet not found" });
        }

        // Validate era if provided
        if (era) {
            const validEras = ['Classical', 'Modern', 'Contemporary', 'Other'];
            if (!validEras.includes(era)) {
                return res.status(400).json({ 
                    message: "Invalid era. Must be: Classical, Modern, Contemporary, or Other" 
                });
            }
        }

        // Check for duplicate name if name is being updated
        if (name && name !== existingPoet.name) {
            const duplicatePoet = await Poet.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: poetId }
            });

            if (duplicatePoet) {
                return res.status(409).json({ 
                    message: "Another poet with this name already exists" 
                });
            }
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (bio) updateData.bio = bio.trim();
        if (era) updateData.era = era;
        if (country) updateData.country = country.trim();
        if (birthYear !== undefined) updateData.birthYear = birthYear;
        if (deathYear !== undefined) updateData.deathYear = deathYear;
        if (image !== undefined) updateData.image = image;

        // Update poet
        const updatedPoet = await Poet.findByIdAndUpdate(
            poetId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            poet: updatedPoet,
            message: "Poet updated successfully"
        });

    } catch (error) {
        console.error("Update poet error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid poet ID" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating poet" });
    }
}

// DELETE /poets/:id - delete poet (admin only)
exports.deletePoet = async (req, res) => {
  try {
    const poetId = req.params.id;

    // Check poems linked to poet
    const poemCount = await Poem.countDocuments({ poet: poetId });
    if (poemCount > 0) {
      return res.status(400).json({
        message: `Cannot delete poet. There are ${poemCount} poems associated with this poet.`
      });
    }

    // Hard delete poet (atomic)
    const deletedPoet = await Poet.findByIdAndDelete(poetId);
    if (!deletedPoet) {
      return res.status(404).json({ message: "Poet not found" });
    }

    // Update stats
    await Stat.findByIdAndUpdate(
      'GLOBAL_STATS',
      { $inc: { poets: -1 } },
      { upsert: true }
    );
    

    res.status(200).json({
      message: "Poet deleted successfully"
    });

  } catch (error) {
    console.error("Delete poet error:", error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid poet ID" });
    }

    res.status(500).json({ message: "Error deleting poet" });
  }
};


/* -------- POEMS -------- */

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

        // Increment poem count in stats
        await Stat.findByIdAndUpdate(
            'GLOBAL_STATS',
            { $inc: { poems: 1 } },
            { upsert: true }
        );


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

        const deletedPoem = await Poem.findByIdAndDelete(poemId);
        if (!deletedPoem) {
        return res.status(404).json({ message: "Poem not found" });
        }


        await Stat.findByIdAndUpdate(
            'GLOBAL_STATS',
            { $inc: { poems: -1 } },
            { upsert: true }
        );

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

// Collection

// GET /collections - get all collections (admin only)
exports.getAllCollections = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', category } = req.query;
        const query = { isActive: true };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;
        const collections = await Collection.find(query)
            .populate('category', 'name type')
            .populate('createdBy', 'name')
            .populate({
                path: 'poems',
                select: 'title content poet category',
                populate: { path: 'poet', select: 'name' }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Collection.countDocuments(query);

        res.status(200).json({
            collections,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                hasNext: skip + collections.length < total
            }
        });

    } catch (error) {
        console.error("Get all collections error:", error);
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

        await Stat.findByIdAndUpdate(
            'GLOBAL_STATS',
            { $inc: { collections: 1 } },
            { upsert: true }
        );

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

    // Hard delete (atomic)
    const deletedCollection = await Collection.findByIdAndDelete(collectionId);
    if (!deletedCollection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    // ✅ Update stats
    await Stat.findByIdAndUpdate(
      'GLOBAL_STATS',
      { $inc: { collections: -1 } },
      { upsert: true }
    );

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
};

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
        if (collection.poems.some(p => p.toString() === poemId)) {
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
        const { poemId } = req.body;

        if (!poemId) {
            return res.status(400).json({ message: "Poem ID is required" });
        }

        // Check if collection exists
        const collection = await Collection.findById(collectionId);
        if (!collection || !collection.isActive) {
            return res.status(404).json({ message: "Collection not found" });
        }

        // Check if poem is in collection
        if (!collection.poems.some(p => p.toString() === poemId)) {
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



// Books

// create book
exports.createBook = async (req, res) => {
  try {
    const { title, author, coverImage, affiliateLink, price, category, language } = req.body;

    if (!title || !coverImage || !affiliateLink) {
      return res.status(400).json({
        message: 'Title, image and affiliate link are required'
      });
    }

    const book = await Book.create({
      title: title.trim(),
      author: author?.trim() || null,
      coverImage,
      affiliateLink,
      price: price || null,
      category: category || null,
      language: language || 'Hindi'
    });

    await Stat.findByIdAndUpdate(
        'GLOBAL_STATS',
        { $inc: { books: 1 } },
        { upsert: true }
    );

    res.status(201).json({
      message: 'Book added successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
};

// update book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

// delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await Stat.findByIdAndUpdate(
        'GLOBAL_STATS',
        { $inc: { books: -1 } },
        { upsert: true }
    );

    res.json({ message: 'Book removed successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};


// Stats

// reset stats
exports.resetStats = async (req, res) => {
  try {
    const stats = await Stat.findByIdAndUpdate(
      'GLOBAL_STATS',
      {
        poems: 0,
        poets: 0,
        collections: 0,
        users: 0,
        languages: 2,
        literaryEras: 3,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      stats,
      message: 'Stats reset successfully'
    });

  } catch (error) {
    console.error('Reset stats error:', error);
    res.status(500).json({ message: 'Error resetting stats' });
  }
};

// sync stats
exports.syncStats = async (req, res) => {
  try {

    const [poems, poets, collections, users, books, poetOwners] = await Promise.all([
      Poem.countDocuments(),
      Poet.countDocuments(),
      Collection.countDocuments(),
      User.countDocuments(),
      Book.countDocuments(),
      User.countDocuments({isPoetOwner: true})
    ]);

    const stats = await Stat.findByIdAndUpdate(
      'GLOBAL_STATS',
      {
        poems,
        poets,
        collections,
        books,
        users,
        poetOwners,
        languages: 2,
        literaryEras: 3
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      stats,
      message: 'Stats synced successfully'
    });

  } catch (error) {
    console.error('Sync stats error:', error);
    res.status(500).json({ message: 'Error syncing stats' });
  }
};


// Categories

// POST /categories - create category (admin only)
exports.createCategory = async (req, res) => {
    try {
        const { name, description, type } = req.body;

        // Validate required fields
        if (!name || !type) {
            return res.status(400).json({ 
                message: "Name and type are required" 
            });
        }
       
        // Check if category already exists (case insensitive)
        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });

        if (existingCategory) {
            return res.status(409).json({ 
                message: "Category with this name already exists" 
            });
        }

        // Create category
        const category = await Category.create({
            name: name.trim(),
            description: description?.trim() || '',
            type
        });

        res.status(201).json({
            category,
            message: "Category created successfully"
        });

    } catch (error) {
        console.error("Create category error:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error creating category" });
    }
}

// PUT /categories/:id - update category (admin only)
exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description, type } = req.body;

        // Find existing category
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        

        // Check for duplicate name if name is being updated
        if (name && name !== existingCategory.name) {
            const duplicateCategory = await Category.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: categoryId }
            });

            if (duplicateCategory) {
                return res.status(409).json({ 
                    message: "Another category with this name already exists" 
                });
            }
        }

        // Prepare update object
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (type) updateData.type = type;

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            category: updatedCategory,
            message: "Category updated successfully"
        });

    } catch (error) {
        console.error("Update category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error updating category" });
    }
}

// DELETE /categories/:id - delete category (admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Find category
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Check if category has poems
        const poemCount = await Poem.countDocuments({ category: categoryId, isActive: true });
        if (poemCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category. There are ${poemCount} poems associated with this category.` 
            });
        }

        // Soft delete (set isActive to false)
        category.isActive = false;
        await category.save();

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete category error:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid category ID" });
        }
        
        res.status(500).json({ message: "Error deleting category" });
    }
}


// poet ownership

// GET /admin/poet-owners
exports.getAllPoetOwners = async (req, res) => {
  try {
    const { search = '' } = req.query;

    const query = {
      owner: { $ne: null },
      isActive: true
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const poets = await Poet.find(query)
      .populate('owner', 'name email')
      .populate('ownerVerifiedBy', 'name email')
      .sort({ ownerAssignedAt: -1 });

    res.status(200).json({
      count: poets.length,
      poets
    });

  } catch (error) {
    console.error('Get poet owners error:', error);
    res.status(500).json({ message: 'Failed to fetch poet owners' });
  }
};

exports.getPoetOwnershipRequests = async (req, res) => {
  try {
    const requests = await PoetOwnershipRequest.find({ status: 'pending' })
      .populate('poet', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });

  } catch (error) {
    console.error('Get ownership requests error:', error);
    res.status(500).json({ message: 'Failed to load requests' });
  }
};


exports.approvePoetOwnership = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { requestId } = req.params;

    const request = await PoetOwnershipRequest
      .findById(requestId)
      .session(session);

    if (!request || request.status !== 'pending') {
      throw new Error('Invalid or already processed request');
    }

    const poet = await Poet
      .findById(request.poet)
      .session(session);

    if (!poet) throw new Error('Poet not found');

    if (poet.owner) {
      throw new Error('Poet already has an owner');
    }

    // Update request
    request.status = 'approved';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save({ session });

    // Update poet
    poet.owner = request.user;
    poet.ownerAssignedAt = new Date();
    poet.ownerVerifiedBy = req.user._id;
    await poet.save({ session });

    await User.findByIdAndUpdate(
      request.user,
      { isPoetOwner: true, ownedPoet: poet._id },
      { session }
    );

    await Stat.findByIdAndUpdate(
        'GLOBAL_STATS',
        { $inc: { poetOwners: 1 } },
        { upsert: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Poet ownership approved successfully' });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Approve ownership error:', error.message);
    res.status(400).json({ message: error.message });
  }
};


exports.rejectPoetOwnership = async (req, res) => {
  try {
    const request = await PoetOwnershipRequest.findById(req.params.requestId);

    if (!request || request.status !== 'pending') {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    // await PoetOwnershipRequest.findOneAndDelete(request._id);

    res.json({ message: 'Ownership request rejected' });

  } catch (error) {
    console.error('Reject ownership error:', error);
    res.status(500).json({ message: 'Rejection failed' });
  }
};


exports.revokePoetOwner = async (req, res) => {
  try {
    const poet = await Poet.findById(req.params.poetId);

    if (!poet) {
      return res.status(404).json({ message: 'Poet not found' });
    }

    if (!poet.owner) {
      return res.status(400).json({ message: 'Poet has no owner' });
    }

    const previousOwner = poet.owner;

    // Poems are intentionally preserved for historical integrity
    poet.owner = null;
    poet.ownerAssignedAt = null;
    poet.ownerVerifiedBy = null;
    await poet.save();

    await PoetOwnershipRequest.updateMany(
        { poet: poet._id, status: 'approved' },
        { status: 'revoked' }
    );

    await User.findByIdAndUpdate(previousOwner, {
        isPoetOwner: false,
        ownedPoet: null
    });

    await Stat.findByIdAndUpdate(
        'GLOBAL_STATS',
        { $inc: { poetOwners: -1 } },
        { upsert: true }
    );

    res.json({ message: 'Poet owner revoked successfully' });

  } catch (error) {
    console.error('Revoke owner error:', error);
    res.status(500).json({ message: 'Failed to revoke owner' });
  }
};


// payment controllers

exports.getAllPayments = async (req, res) => {
    try {

        const { status, purpose, user, from, to, page = 1, limit = 20 } = req.query;

        const query = {};

        if(status) query.status = status;
        if(purpose) query.purpose = purpose;
        if(user) query.user = user;

        if(from || to){
            query.createdAt = {};
            if(from) query.createdAt.$gte = new Date(from);
            if(to) query.createdAt.$lte = new Date(to);
        }

        const payments = await Payment.find(query)
        .populate('user', '_id name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

        const total = await Payment.countDocuments(query);
        return res.status(200).json({
            success: true,
            total,
            page: Number(page),
            payments
        });

    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch payments' });
    }
}

exports.getPaymentByIdAdmin = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', '_id name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: 'paymentId is required' });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
        return res.status(400).json({ message: 'Already refunded' });
    }

    if (payment.status !== 'paid' || !payment.paymentId) {
      return res.status(400).json({ message: 'Payment not refundable' });
    }

    // Call Razorpay
    const refund = await razorpayService.refundPayment({
      paymentId: payment.paymentId,
      amount
    });

    // Atomic update
    payment.status = 'refunded';
    payment.meta = refund;
    await payment.save();

    return res.status(200).json({
      success: true,
      refund
    });
  } catch (error) {
    return res.status(500).json({ message: 'Refund failed' });
  }
};
