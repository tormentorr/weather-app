const { insertLog, getAllLogs } = require('./database');

/**
 * Logs a user action to the console and persists it to the database.
 * @param {string} city - The city that was selected.
 * @param {string} action - The type of action performed.
 * @returns {Promise<object>} The created log entry.
 */
async function logAction(city, action = 'CITY_SELECTED') {
  const entry = await insertLog(city, action);

  console.log(
    `[${entry.timestamp}] Action: ${entry.action} | City: ${entry.city}`
  );

  return entry;
}

/**
 * Returns all stored action logs from the database.
 * @returns {Promise<Array>} Array of log entries.
 */
async function getActionLogs() {
  return getAllLogs();
}

module.exports = { logAction, getActionLogs };
