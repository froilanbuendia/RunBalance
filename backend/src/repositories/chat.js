const { pool } = require("../database/db");

const saveMessage = async (athleteId, role, content) => {
  const { rows } = await pool.query(
    `INSERT INTO chat_messages (athlete_id, role, content)
     VALUES ($1, $2, $3)
     RETURNING id, role, content, created_at`,
    [athleteId, role, content],
  );
  return rows[0];
};

const getHistory = async (athleteId, limit = 30) => {
  const { rows } = await pool.query(
    `SELECT role, content, created_at
     FROM chat_messages
     WHERE athlete_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [athleteId, limit],
  );
  return rows.reverse(); // oldest first for Claude messages array
};

module.exports = { saveMessage, getHistory };
