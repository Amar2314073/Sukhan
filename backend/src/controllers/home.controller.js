const Poem = require('../models/poem');
const Poet = require('../models/poet');
const Category = require('../models/category');
const Collection = require('../models/collection');

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
    const sherCategory = await Category.findOne({ name: "Sher" });

    if (!ghazalCategory || !sherCategory) {
      return res.status(404).json({ message: "Category not found" });
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
    const poetryCollections = await Collection.find({ isActive: true })
    .populate('category', 'name')
    .limit(5)

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

// Random poems for home page
exports.getRandomPoems = async (req, res) => {
  try{
    const sherCategory = await Category.findOne({ name: "Sher" });
    const freeVerseCategory = await Category.findOne({ name: "Free Verse" });
    const ghazalCategory = await Category.findOne({ name: "Ghazal" });
    
    if (!sherCategory || !freeVerseCategory || !ghazalCategory) 
      return res.status(404).json({ message: "Category not found" });

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

    res.status(200).json({
      randomSher,
      randomFreeVerse,
      randomGhazal
    });

  } catch(error){
    console.error("Error fetching random poems:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Random sher
exports.getRandomSher = async (req, res) => {
   try{
    const sherCategory = await Category.findOne({ name: "Sher" });
    
    if (!sherCategory) 
      return res.status(404).json({ message: "Sher category not found" });

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

    res.status(200).json({
      randomSher
    });

  } catch(error){
    console.error("Error fetching random sher:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
// Random free verse
exports.getRandomFreeVerse = async (req, res) => {
   try{
    const freeVerseCategory = await Category.findOne({ name: "Free Verse" });
    
    if (!freeVerseCategory) 
      return res.status(404).json({ message: "Free verse category not found" });
    
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

    res.status(200).json({
      randomFreeVerse
    });

  } catch(error){
    console.error("Error fetching random free verse:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
// Random ghazal
exports.getRandomGhazal = async (req, res) => {
   try{
    const ghazalCategory = await Category.findOne({ name: "Ghazal" });
    
    if (!ghazalCategory) 
      return res.status(404).json({ message: "Sher category not found" });

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

    res.status(200).json({
      randomGhazal
    });

  } catch(error){
    console.error("Error fetching random poems:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Random Collection
exports.getRandomCollection = async (req, res) => {
   try{
    const poetryCollections = await Collection.find({ isActive: true })
    .populate('category', 'name')
    .limit(5)

    res.status(200).json({
      poetryCollections
    });

  } catch(error){
    console.error("Error fetching random poems:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
