const validator = require('validator');

const userValidator = (data) => {
  const mandatoryFields = ['name', 'email', 'password'];

  // Check for missing fields
  const allPresent = mandatoryFields.every((field) => Object.keys(data).includes(field));
  if (!allPresent) throw new Error('Some required fields are missing');

  // Validate name
  if (typeof data.name !== 'string' || data.name.trim().length === 0) {
    throw new Error('Name is required');
  }
  if (data.name.length > 30) {
    throw new Error('Name cannot exceed 30 characters');
  }

  // Validate email
  if (!validator.isEmail(data.email)) {
    throw new Error('Invalid email format');
  }

  // Validate password
  if (data.password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
};

module.exports = userValidator;
