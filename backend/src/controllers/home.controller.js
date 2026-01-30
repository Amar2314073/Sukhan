const Poem = require('../models/poem');
const Poet = require('../models/poet');
const Category = require('../models/category');

// Stats controller
exports.getStats = async (req, res) => {
  try {
    const poemCount = await Poem.countDocuments();
    const poetCount = await Poet.countDocuments();
    res.status(200).json({
      poemCount,
      poetCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Home Page controller
exports.getHomePage = async (req, res) => {
  try {
    // today date
    const today = new Date().toISOString().split("T")[0];
    const seed = parseInt(today.split("-").join(""));

    const ghazalCategory = await Category.findOne({ name: "Ghazal" });

    if (!ghazalCategory) {
      return res.status(404).json({ message: "Ghazal category not found" });
    }

    const sherCategory = await Category.findOne({ name: "Sher" });

    if (!sherCategory) {
      return res.status(404).json({ message: "Sher category not found" });
    }


    // total counts
    const totalGhazals = await Poem.countDocuments({
      category: ghazalCategory._id
    });
    const totalShers = await Poem.countDocuments({
      category: sherCategory._id
    });
    const totalPoets = await Poet.countDocuments();

    // deterministic "random" start index
    const poemSkip = seed % Math.max(totalGhazals - 10, 1);
    const sherSkip = seed % Math.max(totalShers - 5, 1);
    const poetSkip = seed % Math.max(totalPoets - 5, 1);


    // todays poetry
    const todaysPoetry = await Poem.find({category: sherCategory._id})
      .skip(sherSkip)
      .limit(4)
      .populate("poet", "name");

    // featured poems
    const featuredPoems = await Poem.find({category: ghazalCategory._id})
      .skip(poemSkip)
      .limit(10)
      .populate("poet", "name");

    // popular poets
    const popularPoets = await Poet.find()
      .skip(poetSkip)
      .limit(5);

    // collections
    const poetryCollections = await Poem.distinct("collection");

    res.status(200).json({
      date: today,
      todaysPoetry,
      featuredPoems,
      popularPoets,
      poetryCollections
    });

  } catch (error) {
    console.error("Error fetching home page data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
