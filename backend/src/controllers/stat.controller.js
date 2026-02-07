const Stat = require('../models/stat');

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
