CREATE TABLE IF NOT EXISTS votes (
    vote_id TEXT PRIMARY KEY,
    choice TEXT NOT NULL CHECK (choice IN ('cats', 'dogs')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);