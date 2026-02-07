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

module.exports = { upsertActivity };
