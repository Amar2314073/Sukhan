const Poem = require('../models/poem');
const Poet = require('../models/poet');


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
