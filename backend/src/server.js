const express = require('express');
const cors = require('cors');
const { logAction, getActionLogs } = require('./logger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// POST /api/log - Log a user action (city selection)
app.post('/api/log', async (req, res) => {
  try {
    const { city, action } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const logEntry = await logAction(city, action);
    res.status(201).json(logEntry);
  } catch (err) {
    console.error('Failed to log action:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/logs - Retrieve all logged actions
app.get('/api/logs', async (_req, res) => {
  try {
    const logs = await getActionLogs();
    res.json(logs);
  } catch (err) {
    console.error('Failed to get logs:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Weather backend server running on port ${PORT}`);
  });
}

module.exports = app;
