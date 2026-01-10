const Poet = require('../models/poet');
const Poem = require('../models/poem');
const User = require('../models/user');
const Category = require('../models/category');
const Collection = require('../models/collection');

/* -------- DASHBOARD -------- */
exports.dashboard = async (req, res) => {
  const [poets, poems, collections, users] = await Promise.all([
    Poet.countDocuments(),
    Poem.countDocuments(),
    Collection.countDocuments(),
    User.countDocuments()
  ]);

  res.json({
    poets,
    poems,
    collections,
    users
  });
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
    const { name, bio, era, birthYear, deathYear, image, country } = req.body;

    if (!name || !bio || !era || !country) {
      return res.status(400).json({
        message: "Name, bio, era, and country are required"
      });
    }

    const validEras = ['Classical', 'Modern', 'Contemporary', 'Other'];
    if (!validEras.includes(era)) {
      return res.status(400).json({ message: "Invalid era" });
    }

    const existingPoet = await Poet.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingPoet) {
      return res.status(409).json({ message: "Poet already exists" });
    }

    const poet = await Poet.create({
      name: name.trim(),
      bio: bio.trim(),
      era,
      birthYear: birthYear || null,
      deathYear: deathYear || null,
      country: country.trim(),
      image: image || ''
    });

    res.status(201).json({ poet });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating poet" });
  }
};


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

        // Find poet
        const poet = await Poet.findById(poetId);
        if (!poet) {
            return res.status(404).json({ message: "Poet not found" });
        }

        // Check if poet has poems
        const poemCount = await Poem.countDocuments({ poet: poetId });
        if (poemCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete poet. There are ${poemCount} poems associated with this poet.` 
            });
        }

        // Soft delete (set isActive to false)
        // poet.isActive = false;
        // await poet.save();

        await Poet.findByIdAndDelete(poetId);

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
}

/* -------- POEMS -------- */

// POST /poems - create poem (admin only)
exports.createPoem = async (req, res) => {
    try {
        const { title, content, poet, category, tags } = req.body;
        if (
            !content ||
            (
                !content.urdu?.trim() &&
                !content.hindi?.trim() &&
                !content.roman?.trim()
            )
            ) {
            return res.status(400).json({
                message: "At least one language content is required"
            });
        }



        // Validate required fields
        if (!title || !poet || !category) {
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
                urdu: content.urdu || '',
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
                urdu: content.urdu || existingPoem.content.urdu,
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
        // poem.isActive = false;
        // await poem.save();

        await Poem.findByIdAndDelete(poemId);

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