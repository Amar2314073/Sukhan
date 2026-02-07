const rateLimit = require('express-rate-limit');

const claimLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 4,
  message: {
    message: 'Too many ownership claims. Try again later.'
  }
});

module.exports = claimLimiter;
