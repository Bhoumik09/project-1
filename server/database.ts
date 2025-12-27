import { Pool } from "pg"

// Export pool so we can use it elsewhere if needed
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export async function initDatabase() {
  try {
    // 1. Create Games Table (Standard Game Data)
    await pool.query(`
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
      )
    `)

    // 2. Create Players Table (Leaderboard)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        username VARCHAR(255) PRIMARY KEY,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        total_games INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 3. Create Analytics Table (New!)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        game_id VARCHAR(255),
        player1 VARCHAR(255),
        player2 VARCHAR(255),
        metadata JSONB,
        timestamp TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create index for faster analytics queries
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_analytics_game_id ON analytics_events(game_id)`)

    console.log("[v0] Database initialized successfully")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
  }
}

// ... (Your existing saveGame, updatePlayerStats, getLeaderboard functions remain here) ...
export async function saveGame(gameData: any) {
    // ... paste your existing saveGame code here ...
    try {
        await pool.query(
          `INSERT INTO games (player1, player2, winner, is_draw, is_bot_game, moves_count, duration_seconds)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            gameData.player1,
            gameData.player2,
            gameData.winner,
            gameData.isDraw,
            gameData.isBotGame,
            gameData.movesCount,
            gameData.durationSeconds,
          ],
        )
    
        // Update player stats logic (Keep your existing logic here)
        if (!gameData.isDraw && gameData.winner) {
             await updatePlayerStats(gameData.winner, "win")
             const loser = gameData.winner === gameData.player1 ? gameData.player2 : gameData.player1
             await updatePlayerStats(loser, "loss")
        } else if (gameData.isDraw) {
             await updatePlayerStats(gameData.player1, "draw")
             await updatePlayerStats(gameData.player2, "draw")
        }

      } catch (error) {
        console.error("[v0] Error saving game:", error)
      }
}

// ... (Keep updatePlayerStats and getLeaderboard as they were) ...
async function updatePlayerStats(username: string, result: "win" | "loss" | "draw") {
    try {
        await pool.query(
        `INSERT INTO players (username, wins, losses, draws, total_games)
        VALUES ($1, $2, $3, $4, 1)
        ON CONFLICT (username) 
        DO UPDATE SET 
            wins = players.wins + $2,
            losses = players.losses + $3,
            draws = players.draws + $4,
            total_games = players.total_games + 1`,
        [username, result === "win" ? 1 : 0, result === "loss" ? 1 : 0, result === "draw" ? 1 : 0],
        )
    } catch (error) {
        console.error("[v0] Error updating player stats:", error)
    }
}

export async function getLeaderboard(limit = 10) {
    try {
        const result = await pool.query(
        `SELECT username, wins, 
        ROW_NUMBER() OVER (ORDER BY wins DESC, total_games ASC) as rank
        FROM players
        ORDER BY wins DESC, total_games ASC
        LIMIT $1`,
        [limit],
        )
        return result.rows
    } catch (error) {
        console.error("[v0] Error fetching leaderboard:", error)
        return []
    }
}

// === NEW FUNCTION: Save Analytics Event ===
export async function saveAnalyticsEvent(event: any) {
  try {
    await pool.query(
      `INSERT INTO analytics_events (event_type, game_id, player1, player2, metadata, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        event.type,
        event.gameId,
        event.player1 || "Unknown",
        event.player2 || "Unknown",
        JSON.stringify(event), // Store full event data in metadata
        new Date(event.timestamp)
      ]
    )
    console.log(`[v0] Saved analytics event: ${event.type}`)
  } catch (error) {
    console.error("[v0] Error saving analytics event:", error)
  }
}