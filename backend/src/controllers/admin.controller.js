const Poet = require('../models/poet');
const Poem = require('../models/poem');
const User = require('../models/user');
const Category = require('../models/category');

/* -------- DASHBOARD -------- */
exports.dashboard = async (req, res) => {
  const [poets, poems, users] = await Promise.all([
    Poet.countDocuments(),
    Poem.countDocuments(),
    User.countDocuments()
  ]);

  res.json({
    poets,
    poems,
    users
  });
};

/* -------- POETS -------- */

// GET /poets - get all poets (admin only)
exports.getAllPoets = async (req, res) => {
  try {
    const poets = await Poet.find().sort({ name: 1 }).select('name');
    res.status(200).json({ poets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching poets" });
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
