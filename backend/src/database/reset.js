require("dotenv").config();
const { pool } = require("./db");

async function reset() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("❌ Cannot reset DB in production");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);

    await client.query("COMMIT");
    console.log("♻️  Database reset complete");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Reset failed", err);
  } finally {
    client.release();
  }
}

reset();
