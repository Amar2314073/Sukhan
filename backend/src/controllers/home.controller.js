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

    const freeVerseCategory = await Category.findOne({ name: "Free Verse" });

    if (!freeVerseCategory) {
      return res.status(404).json({ message: "Free Verse category not found" });
    }

    const randomFreeVerse = await Poem.aggregate([
      {
        $match: {
          category: freeVerseCategory._id,
          isActive: true
        }
      },
      {
        $sample: { size: 5 }
      },
      {
        $lookup: {
          from: "poets",
          localField: "poet",
          foreignField: "_id",
          as: "poet"
        }
      },
      {
        $unwind: "$poet"
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          likes: 1,
          views: 1,
          createdAt: 1,
          poet: {
            _id: 1,
            name: 1,
            image: 1
          }
        }
      }
    ]);

    const randomSher = await Poem.aggregate([
      {
        $match: { category: sherCategory._id, isActive: true }
      },
      {
        $sample: { size: 5 }
      },
      {
        $lookup: {
          from: "poets",
          localField: "poet",
          foreignField: "_id",
          as: "poet"
        }
      },
      {
        $unwind: "$poet"
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          likes: 1,
          views: 1,
          createdAt: 1,
          poet: {
            _id: 1,
            name: 1,
            image: 1
          }
        }
      }
    ]);

    const randomGhazal = await Poem.aggregate([
      {
        $match: { category: ghazalCategory._id, isActive: true }
      },
      {
        $sample: { size: 5 }
      },
      {
        $lookup: {
          from: "poets",
          localField: "poet",
          foreignField: "_id",
          as: "poet"
        }
      },
      {
        $unwind: "$poet"
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          likes: 1,
          views: 1,
          createdAt: 1,
          poet: {
            _id: 1,
            name: 1,
            image: 1
          }
        }
      }
    ]);

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
      randomFreeVerse,
      randomSher,
      randomGhazal,
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
