const Stat = require('../models/stat');
const Poem = require('../models/poem');
const Poet = require('../models/poet');
const Collection = require('../models/collection');
const User = require('../models/user');

exports.getStats = async (req, res) => {
  try {
    const stats = await Stat.findById('GLOBAL_STATS', {users: 0});

    if (!stats) {
      const initialStats = await Stat.create({ _id: 'GLOBAL_STATS' });
      return res.status(200).json(initialStats);
    }

    res.status(200).json(stats);

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

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

exports.syncStats = async (req, res) => {
  try {

    const [poems, poets, collections, users] = await Promise.all([
      Poem.countDocuments(),
      Poet.countDocuments(),
      Collection.countDocuments(),
      User.countDocuments()
    ]);

    const stats = await Stat.findByIdAndUpdate(
      'GLOBAL_STATS',
      {
        poems,
        poets,
        collections,
        users,
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
