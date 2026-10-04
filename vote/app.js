const { randomUUID } = require('node:crypto');
const path = require('node:path');
const express = require('express');
const { createClient } = require('redis');

const app = express();
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.on('error', (error) => console.error('Redis connection error:', error.message));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_request, response) => response.sendStatus(200));

app.post('/api/vote', async (request, response) => {
  const { choice } = request.body || {};
  if (!['cats', 'dogs'].includes(choice)) {
    return response.status(400).json({ error: 'Choose cats or dogs.' });
  }

  try {
    await redis.lPush('votes', JSON.stringify({ id: randomUUID(), choice }));
    return response.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Could not queue vote:', error.message);
    return response.status(503).json({ error: 'Voting is temporarily unavailable.' });
  }
});

async function start() {
  await redis.connect();
  app.listen(5000, '0.0.0.0', () => console.log('Voting app listening on :5000'));
}

start().catch((error) => {
  console.error('Voting app failed to start:', error);
  process.exit(1);
});