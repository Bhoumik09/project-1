import { Pool } from 'pg';

// Use a global variable to prevent creating too many connections in development
let pool: Pool | null = null;

export function getDbClient() {
  // Return existing pool if already created
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("No database connection string found. Please set DATABASE_URL or POSTGRES_URL.");
  }

  // Create a new Pool
  pool = new Pool({
    connectionString,
    // SSL is usually required for cloud hosts (Neon/Supabase) but can cause issues on localhost.
    // This logic enables it only when not strictly on localhost, or you can force it if needed.
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 10, // Maximum number of clients in the pool
  });

  console.log("[v0] Database client initialized (PostgreSQL Pool)");
  return pool;
}

export async function query(sql: string, params?: any[]) {
  const client = getDbClient();
  
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error("[v0] Database query error:", error);
    throw error;
  }
}