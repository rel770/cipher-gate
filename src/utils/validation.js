/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and message
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: 'Username is required and must be a string' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 50) {
    return { isValid: false, message: 'Username must not exceed 50 characters' };
  }
  
  // Check for valid characters (alphanumeric and underscore)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true, message: 'Valid username' };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required and must be a string' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password must not exceed 128 characters' };
  }
  
  return { isValid: true, message: 'Valid password' };
}

/**
 * Sanitize input to prevent basic injection attacks
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input.trim().replace(/[<>]/g, '');
}

module.exports = {
  validateUsername,
  validatePassword,
  sanitizeInput
};
