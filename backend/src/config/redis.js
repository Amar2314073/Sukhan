const { createClient } = require('redis');


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-13626.crce179.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13626
    }
});


redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

module.exports = redisClient;

