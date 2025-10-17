import { Pool } from "pg";
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function runMigrations() {
  const sql = await import("./queries.sql?raw");
  await pool.query(sql.default);
  console.log("✅ Migraciones aplicadas");
}
