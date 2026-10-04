const { Pool } = require('pg');
const { createClient } = require('redis');

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
const database = new Pool({ connectionString: process.env.DATABASE_URL });
redis.on('error', (error) => console.error('Redis connection error:', error.message));

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function processVotes() {
  await redis.connect();

  while (true) {
    try {
      const message = await redis.brPop('votes', 0);
      const vote = JSON.parse(message.element);
      if (!vote.id || !['cats', 'dogs'].includes(vote.choice)) continue;

      await database.query(
        'INSERT INTO votes (vote_id, choice) VALUES ($1, $2) ON CONFLICT (vote_id) DO NOTHING',
        [vote.id, vote.choice],
      );
      console.log(`Stored vote ${vote.id}: ${vote.choice}`);
    } catch (error) {
      console.error('Vote processing error:', error.message);
      await delay(2000);
    }
  }
}

processVotes().catch(async (error) => {
  console.error('Worker failed to start:', error);
  await database.end();
  process.exit(1);
});