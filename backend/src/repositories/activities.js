const { pool } = require("../database/db");

const upsertActivity = async (activity, athleteId) => {
  const query = `
    INSERT INTO activities (
      id,
      athlete_id,
      name,
      type,
      distance,
      moving_time,
      elapsed_time,
      total_elevation_gain,
      start_date,
      timezone,
      average_speed,
      max_speed,
      average_heartrate,
      max_heartrate,
      gear_id
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      distance = EXCLUDED.distance,
      moving_time = EXCLUDED.moving_time,
      elapsed_time = EXCLUDED.elapsed_time,
      total_elevation_gain = EXCLUDED.total_elevation_gain,
      average_speed = EXCLUDED.average_speed,
      max_speed = EXCLUDED.max_speed,
      average_heartrate = EXCLUDED.average_heartrate,
      max_heartrate = EXCLUDED.max_heartrate;
  `;

  const values = [
    activity.id,
    athleteId,
    activity.name,
    activity.type,
    activity.distance,
    activity.moving_time,
    activity.elapsed_time,
    activity.total_elevation_gain,
    activity.start_date,
    activity.timezone,
    activity.average_speed,
    activity.max_speed,
    activity.average_heartrate ?? null,
    activity.max_heartrate ?? null,
    activity.gear_id ?? null,
  ];

  await pool.query(query, values);
};

const getActivitiesByAthlete = async (athleteId, { limit, offset, type }) => {
  const query = `
    SELECT
      id, name, type,
      distance / 1609.34 AS miles,
      moving_time,
      total_elevation_gain,
      start_date,
      average_speed,
      average_heartrate,
      max_heartrate
    FROM activities
    WHERE athlete_id = $1
      AND ($3::text IS NULL OR type = $3)
    ORDER BY start_date DESC
    LIMIT $2 OFFSET $4
  `;
  const { rows } = await pool.query(query, [athleteId, limit, type, offset]);
  return rows;
};

const countActivities = async (athleteId, type) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM activities
    WHERE athlete_id = $1
      AND ($2::text IS NULL OR type = $2)
  `;
  const { rows } = await pool.query(query, [athleteId, type]);
  return rows[0];
};

const getRunStats = async (athleteId) => {
  const query = `
    SELECT
      COUNT(*)                        AS total_runs,
      COALESCE(SUM(distance / 1609.34), 0) AS total_miles,
      COALESCE(SUM(moving_time), 0)   AS total_seconds
    FROM activities
    WHERE athlete_id = $1
      AND type = 'Run'
  `;
  const { rows } = await pool.query(query, [athleteId]);
  return rows[0];
};

const getStreak = async (athleteId) => {
  const query = `
    WITH run_days AS (
      SELECT DISTINCT DATE(start_date) AS run_date
      FROM activities
      WHERE athlete_id = $1 AND type = 'Run'
    ),
    streaks AS (
      SELECT
        run_date,
        run_date - (ROW_NUMBER() OVER (ORDER BY run_date DESC) - 1) * INTERVAL '1 day' AS grp
      FROM run_days
    )
    SELECT COUNT(*)::int AS streak
    FROM streaks
    WHERE grp = (
      SELECT grp FROM streaks
      WHERE run_date >= CURRENT_DATE - INTERVAL '1 day'
      ORDER BY run_date DESC
      LIMIT 1
    )
  `;
  const { rows } = await pool.query(query, [athleteId]);
  return rows[0]?.streak ?? 0;
};

const getRunTypeBreakdown = async (athleteId) => {
  const query = `
    SELECT
      COUNT(CASE WHEN distance < 4828                        THEN 1 END)::int AS short_count,
      COUNT(CASE WHEN distance >= 4828 AND distance < 11265  THEN 1 END)::int AS medium_count,
      COUNT(CASE WHEN distance >= 11265                      THEN 1 END)::int AS long_count
    FROM activities
    WHERE athlete_id = $1 AND type = 'Run'
  `;
  const { rows } = await pool.query(query, [athleteId]);
  return rows[0];
};

const getPersonalRecords = async (athleteId) => {
  const query = `
    SELECT
      MIN(CASE WHEN distance >= 1609   THEN (moving_time * 1609.34  / distance)::int END) AS mile_seconds,
      MIN(CASE WHEN distance >= 5000   THEN (moving_time * 5000.0   / distance)::int END) AS fivek_seconds,
      MIN(CASE WHEN distance >= 10000  THEN (moving_time * 10000.0  / distance)::int END) AS tenk_seconds,
      MIN(CASE WHEN distance >= 21097  THEN (moving_time * 21097.0  / distance)::int END) AS half_seconds,
      MIN(CASE WHEN distance >= 42195  THEN (moving_time * 42195.0  / distance)::int END) AS marathon_seconds
    FROM activities
    WHERE athlete_id = $1
      AND type = 'Run'
  `;
  const { rows } = await pool.query(query, [athleteId]);
  return rows[0];
};

module.exports = { upsertActivity, getActivitiesByAthlete, countActivities, getRunStats, getPersonalRecords, getStreak, getRunTypeBreakdown };
