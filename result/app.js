const path = require('node:path');
const express = require('express');
const { Pool } = require('pg');

const app = express();
const database = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', async (_request, response) => {
  try {
    await database.query('SELECT 1');
    response.sendStatus(200);
  } catch (_error) {
    response.sendStatus(503);
  }
});

app.get('/api/results', async (_request, response) => {
  try {
    const result = await database.query(
      "SELECT choice, COUNT(*)::int AS count FROM votes GROUP BY choice",
    );
    const counts = { cats: 0, dogs: 0 };
    result.rows.forEach(({ choice, count }) => { counts[choice] = count; });
    response.json(counts);
  } catch (error) {
    console.error('Could not read results:', error.message);
    response.status(503).json({ error: 'Results are temporarily unavailable.' });
  }
});

app.listen(5001, '0.0.0.0', () => console.log('Results app listening on :5001'));