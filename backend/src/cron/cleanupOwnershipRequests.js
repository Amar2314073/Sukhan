const cron = require('node-cron');
const PoetOwnershipRequest = require('../models/poetOwnershipRequest');

cron.schedule('0 3 * * *', async () => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const result = await PoetOwnershipRequest.deleteMany({
      status: 'rejected',
      createdAt: { $lt: oneMonthAgo }
    });

    console.log(
      `[CRON] Deleted ${result.deletedCount} rejected ownership requests`
    );

  } catch (error) {
    console.error('[CRON] Ownership cleanup failed:', error);
  }
});
