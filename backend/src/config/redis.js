const { createClient } = require('redis');


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-14923.c12.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 14923
    }
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
});

module.exports = redisClient;


