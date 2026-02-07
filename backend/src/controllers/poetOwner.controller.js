const Poet = require('../models/poet');
const Poem = require('../models/poem');
const Category = require('../models/category');
const PoetOwnershipRequest = require('../models/poetOwnershipRequest');

/* Update own poet profile - Allowed fields only */
exports.updatePoet = async (req, res) => {
  try {
    const poet = req.poet;
    const { name, bio, era, country, birthYear, deathYear, image } = req.body;

    // Whitelist fields
    if (name !== undefined) poet.name = name.trim();
    if (bio !== undefined) poet.bio = bio.trim();
    if (era !== undefined) poet.era = era;
    if (country !== undefined) poet.country = country.trim();
    if (birthYear !== undefined) poet.birthYear = birthYear;
    if (deathYear !== undefined) poet.deathYear = deathYear;
    if (image !== undefined) poet.image = image;

    await poet.save();

    res.status(200).json({
      poet,
      message: 'Poet profile updated successfully'
    });

  } catch (error) {
    console.error('Poet update error:', error);
    res.status(500).json({ message: 'Failed to update poet profile' });
  }
};

/* Create poem for own poet */
exports.createPoem = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        message: 'Title, content and category are required'
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const poem = await Poem.create({
      title: title.trim(),
      content: {
        hindi: content.hindi || '',
        roman: content.roman || ''
      },
      poet: req.poet._id,
      category
    });

    res.status(201).json({
      poem,
      message: 'Poem created successfully'
    });

  } catch (error) {
    console.error('Create poem error:', error);
    res.status(500).json({ message: 'Failed to create poem' });
  }
};

/* Update poem belonging to own poet */
exports.updatePoem = async (req, res) => {
  try {
    const poemId = req.params.id;
    const { title, content, category } = req.body;

    const poem = await Poem.findOne({
      _id: poemId,
      poet: req.poet._id
    });

    if (!poem) {
      return res.status(404).json({
        message: 'Poem not found or access denied'
      });
    }

    if (title !== undefined) poem.title = title.trim();

    if (content) {
      poem.content = {
        hindi: content.hindi || poem.content.hindi,
        roman: content.roman || poem.content.roman
      };
    }

    if (category !== undefined) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
      poem.category = category;
    }


    await poem.save();

    res.status(200).json({
      poem,
      message: 'Poem updated successfully'
    });

  } catch (error) {
    console.error('Update poem error:', error);
    res.status(500).json({ message: 'Failed to update poem' });
  }
};

exports.submitClaim = async (req, res) => {
  try {
    const { poetId, claimantName, claimantEmail } = req.body;

    if (!poetId || !claimantName || !claimantEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const poet = await Poet.findById(poetId);
    if (!poet || !poet.isActive) {
      return res.status(404).json({ message: 'Poet not found' });
    }

    // agar already owner hai
    if (poet.owner) {
      return res.status(400).json({
        message: 'This poet already has a verified owner'
      });
    }

    const request = await PoetOwnershipRequest.create({
      poet: poetId,
      user: req.user._id,
      claimantName,
      claimantEmail
    });

    res.status(201).json({
      message: 'Ownership claim submitted',
      request
    });

  } catch (err) {
    // duplicate pending request
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'You already have a pending request for this poet'
      });
    }

    res.status(500).json({ message: 'Failed to submit claim' });
  }
};


