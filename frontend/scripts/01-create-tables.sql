-- 1. Players table (Leaderboard)
CREATE TABLE IF NOT EXISTS players (
  username VARCHAR(255) PRIMARY KEY,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Games table (Match History)
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  player1 VARCHAR(255) NOT NULL,
  player2 VARCHAR(255) NOT NULL,
  winner VARCHAR(255),
  is_draw BOOLEAN DEFAULT FALSE,
  is_bot_game BOOLEAN DEFAULT FALSE,
  moves_count INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Analytics events table (Kafka Consumer Target)
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  game_id VARCHAR(255),
  player1 VARCHAR(255),
  player2 VARCHAR(255),
  metadata JSONB,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_wins ON players(wins DESC, total_games ASC);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_game_id ON analytics_events(game_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);