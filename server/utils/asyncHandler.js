/**
 * Wraps an asynchronous middleware/controller function, catching any execution errors
 * and routing them to the Express centralized error handling middleware.
 *
 * @param {Function} fn - The asynchronous function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
