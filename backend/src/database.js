const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/weather',
  ssl: process.env.DATABASE_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,
});

let initialized = false;

/**
 * Initialize the database table if it doesn't exist.
 */
async function initDb() {
  if (initialized) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS action_logs (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMPTZ NOT NULL,
      city TEXT NOT NULL,
      action TEXT NOT NULL
    )
  `);
  initialized = true;
}

/**
 * Insert a log entry into the database.
 * @param {string} city
 * @param {string} action
 * @returns {object} The created log entry.
 */
async function insertLog(city, action) {
  await initDb();
  const timestamp = new Date().toISOString();
  const result = await pool.query(
    'INSERT INTO action_logs (timestamp, city, action) VALUES ($1, $2, $3) RETURNING id, timestamp, city, action',
    [timestamp, city, action]
  );
  return result.rows[0];
}

/**
 * Retrieve all log entries from the database.
 * @returns {Array} Array of log entries.
 */
async function getAllLogs() {
  await initDb();
  const result = await pool.query(
    'SELECT * FROM action_logs ORDER BY id DESC'
  );
  return result.rows;
}

/**
 * Close the database pool.
 */
async function closeDb() {
  await pool.end();
  initialized = false;
}

/**
 * Get the pool (for testing).
 */
function getPool() {
  return pool;
}

module.exports = { initDb, insertLog, getAllLogs, closeDb, getPool };
