require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ensure tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      const version = file;

      const { rows } = await client.query(
        "SELECT 1 FROM schema_migrations WHERE version = $1",
        [version]
      );

      if (rows.length > 0) {
        console.log(`⏭️  Skipping ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

      console.log(`🚀 Running ${file}`);
      await client.query(sql);

      await client.query(
        "INSERT INTO schema_migrations (version) VALUES ($1)",
        [version]
      );
    }

    await client.query("COMMIT");
    console.log("✅ Migrations complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed", err);
  } finally {
    client.release();
  }
}

migrate();
