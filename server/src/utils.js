/**
 * Generates a random ID
 * @returns {string} A random ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

module.exports = {
    generateId
}; 