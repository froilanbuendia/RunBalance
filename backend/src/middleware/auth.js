const jwt = require("jsonwebtoken");
const { pool } = require("../database/db");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Use the correct field from your JWT
    const athleteId = payload.athleteId;

    const { rows } = await pool.query(
      "SELECT id, access_token FROM athletes WHERE id = $1",
      [athleteId]
    );

    if (!rows.length) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};
