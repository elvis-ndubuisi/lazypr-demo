/**
 * Utility Functions
 *
 * Helper functions for the demo application.
 */

/**
 * Format a date to ISO string
 * @param {Date} date - Date to format
 * @returns {string} ISO formatted date
 */
function formatDate(date = new Date()) {
  return date.toISOString();
}

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string for display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
}

/**
 * Create a greeting message
 * @param {string} name - Name to greet
 * @returns {string} Greeting message
 */
function createGreeting(name) {
  return `Hello, ${name}! Welcome to lazyPR demo.`;
}

/**
 * Parse JSON safely
 * @param {string} json - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed object or default value
 */
function safeJsonParse(json, defaultValue = null) {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Calculate pagination offset
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @returns {number} Offset for database query
 */
function getPaginationOffset(page, limit = 10) {
  return (Math.max(1, page) - 1) * limit;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Convert camelCase to snake_case
 * @param {string} str - camelCase string
 * @returns {string} snake_case string
 */
function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert snake_case to camelCase
 * @param {string} str - snake_case string
 * @returns {string} camelCase string
 */
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

module.exports = {
  formatDate,
  generateId,
  deepClone,
  isValidEmail,
  sanitizeString,
  safeJsonParse,
  debounce,
  getPaginationOffset,
  truncateText,
  camelToSnake,
  snakeToCamel,
};
