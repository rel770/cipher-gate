/**
 * Check if array is in ascending order without using built-in functions
 * @param {number[]} arr - Array of numbers to check
 * @returns {boolean} - True if array is in ascending order
 */
function isAscendingOrder(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Calculate sum of array elements without using built-in functions
 * @param {number[]} arr - Array of numbers to sum
 * @returns {number} - Sum of all elements
 */
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

/**
 * Validate if input is a valid array of integers
 * @param {any} input - Input to validate
 * @returns {boolean} - True if valid array of integers
 */
function isValidIntegerArray(input) {
  if (!Array.isArray(input)) {
    return false;
  }

  for (let i = 0; i < input.length; i++) {
    if (!Number.isInteger(input[i])) {
      return false;
    }
  }

  return true;
}

module.exports = {
  isAscendingOrder,
  calculateSum,
  isValidIntegerArray,
};
