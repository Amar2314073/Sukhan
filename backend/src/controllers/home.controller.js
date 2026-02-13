const Poem = require('../models/poem');
const Poet = require('../models/poet');
const Category = require('../models/category');
const Collection = require('../models/collection');



// Home Page controller
exports.getHomePage = async (req, res) => {
  try {
    // ================= FIND REQUIRED CATEGORIES =================
    const [sherCategory, ghazalCategory] = await Promise.all([
      Category.findOne({ name: "Sher" }),
      Category.findOne({ name: "Ghazal" })
    ]);

    if (!sherCategory || !ghazalCategory) {
      return res.status(404).json({
        message: "Required categories not found"
      });
    }

    // ================= HERO SHER (1 Random Strong Entry) =================
    const heroSher = await Poem.aggregate([
      {
        $match: {
          category: sherCategory._id,
          isActive: true
        }
      },
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: "poets",
          localField: "poet",
          foreignField: "_id",
          as: "poet"
        }
      },
      { $unwind: "$poet" },
      {
        $project: {
          _id: 1,
          content: 1,
          poet: {
            _id: "$poet._id",
            name: "$poet.name",
            image: "$poet.image"
          }
        }
      }
    ]);

    // ================= TODAY'S PICK =================
    const todaysPick = await Poem.find({
      category: sherCategory._id,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .populate("poet", "name image");

    // ================= FEATURED GHAZALS =================
    const featuredPoems = await Poem.find({
      category: ghazalCategory._id,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("poet", "name image");

    // ================= POPULAR POETS =================
    const popularPoets = await Poet.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(4);

    // ================= FEATURED COLLECTIONS =================
    const featuredCollections = await Collection.find({
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("category", "name");

    // ================= RESPONSE =================
    res.status(200).json({
      heroSher: heroSher[0] || null,
      todaysPick: todaysPick[0] || null,
      featuredPoems,
      popularPoets,
      featuredCollections
    });

  } catch (error) {
    console.error("Error fetching home page:", error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};


