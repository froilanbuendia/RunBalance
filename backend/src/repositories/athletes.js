const { pool } = require("../database/db");

/**
 * Insert or update athlete info + tokens
 */
const upsertAthlete = async (athlete, tokens) => {
  const query = `
    INSERT INTO athletes (
      id,
      username,
      firstname,
      lastname,
      profile,
      city,
      state,
      country,
      access_token,
      refresh_token,
      token_expires_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,to_timestamp($11))
    ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      firstname = EXCLUDED.firstname,
      lastname = EXCLUDED.lastname,
      profile = EXCLUDED.profile,
      city = EXCLUDED.city,
      state = EXCLUDED.state,
      country = EXCLUDED.country,
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      token_expires_at = EXCLUDED.token_expires_at,
      updated_at = NOW()
    RETURNING id;
  `;

  const values = [
    athlete.id,
    athlete.username,
    athlete.firstname,
    athlete.lastname,
    athlete.profile,
    athlete.city,
    athlete.state,
    athlete.country,
    tokens.access_token,
    tokens.refresh_token,
    tokens.expires_at,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Save only the tokens for an athlete
 */
const saveAthleteTokens = async (athleteId, tokens) => {
  const query = `
    UPDATE athletes
    SET access_token=$1, refresh_token=$2, token_expires_at=to_timestamp($3), updated_at=NOW()
    WHERE id=$4
    RETURNING id;
  `;
  const values = [
    tokens.access_token,
    tokens.refresh_token,
    tokens.expires_at,
    athleteId,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Get tokens for a specific athlete
 */
const getAthleteTokens = async (athleteId) => {
  const query = `
    SELECT access_token, refresh_token, extract(epoch from token_expires_at) as token_expires_at
    FROM athletes
    WHERE id=$1
  `;
  const { rows } = await pool.query(query, [athleteId]);
  return rows[0];
};

module.exports = { upsertAthlete, saveAthleteTokens, getAthleteTokens };
