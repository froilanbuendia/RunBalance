const { pool } = require("../database/db");

// weeklyGoals.js
exports.getRollingWeeklyGoal = async (athleteId) => {
  const res = await pool.query(
    `SELECT 
        g.target_distance,
        COALESCE(SUM(a.distance / 1609.34), 0) AS completed_distance
     FROM weekly_goals g
     LEFT JOIN activities a
        ON a.athlete_id = g.athlete_id
        AND a.start_date >= NOW() - INTERVAL '7 days'
     WHERE g.athlete_id = $1
     GROUP BY g.target_distance`,
    [athleteId],
  );

  return res.rows[0];
};
/**
 * Get weekly mileage for the most recent week
 * Returns { week, miles }
 */
exports.getRolling7DayLoad = async (athleteId) => {
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(SUM(a.distance)/1609.34, 0) AS rolling_7d_miles
    FROM activities a
    WHERE a.athlete_id = $1
      AND a.type = 'Run'
      AND a.start_date >= NOW() - interval '7 days';
    `,
    [athleteId],
  );

  return rows[0];
};

exports.getLastWeekLoad = async (athleteId) => {
  const { rows } = await pool.query(
    `
    SELECT
  COALESCE(SUM(a.distance)/1609.34, 0) AS last_week_miles
FROM activities a
WHERE a.athlete_id = $1
  AND a.type = 'Run'
  AND a.start_date >= NOW() - interval '14 days'
  AND a.start_date < NOW() - interval '7 days';
    `,
    [athleteId],
  );

  return rows[0];
};

exports.getRolling7DayStats = async (athleteId) => {
  const { rows } = await pool.query(
    `
    SELECT
      COUNT(*) AS runs,
      COALESCE(SUM(a.moving_time), 0) AS total_seconds
    FROM activities a
    WHERE a.athlete_id = $1
      AND a.type = 'Run'
      AND a.start_date >= NOW() - interval '7 days';
    `,
    [athleteId],
  );

  return rows[0];
};

exports.getRolling28DayLoad = async (athleteId) => {
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(SUM(a.distance)/1609.34, 0) AS rolling_28d_miles
    FROM activities a
    WHERE a.athlete_id = $1
      AND a.type = 'Run'
      AND a.start_date >= NOW() - interval '28 days';
    `,
    [athleteId],
  );

  return rows[0];
};

/**
 * Get rolling 4-week average, last 4 weeks including current week
 * Returns array of weeks with miles + rolling 4wk average
 */
exports.getRollingMileage = async (athleteId, weeks) => {
  const { rows } = await pool.query(
    `
    WITH series AS (
      SELECT generate_series(
        date_trunc('week', NOW()) - interval '${weeks - 1} week',
        date_trunc('week', NOW()),
        interval '1 week'
      ) AS week
    )
    SELECT
      s.week,
      COALESCE(SUM(a.distance) / 1609.34, 0) AS miles
    FROM series s
    LEFT JOIN activities a
      ON a.start_date >= s.week
      AND a.start_date < s.week + interval '1 week'
      AND a.athlete_id = $1
      AND a.type = 'Run'
    GROUP BY s.week
    ORDER BY s.week;
    `,
    [athleteId],
  );

  return rows;
};

exports.getAveragePaceByMiles = async (athleteId) => {
  const { rows } = await pool.query(
    `
      SELECT
        ROUND(a.distance/1609.34) AS miles,
        TO_CHAR(
          MAKE_INTERVAL(secs => AVG(a.moving_time / (a.distance/1609.34))),
          'MI:SS'
        ) AS avg_pace
      FROM activities a
      WHERE a.athlete_id = $1
        AND a.type = 'Run'
        AND a.distance >= 1609.34 -- only 1 mile or longer
      GROUP BY miles
      ORDER BY miles;
      `,
    [athleteId],
  );

  return rows;
};

/**
 * Get acute/chronic load (ACWR) for last 4 weeks
 * Handles weeks with no runs
 * Returns { acute_load, chronic_load, acwr }
 */
exports.getRollingAcwr = async (athleteId) => {
  const { rows } = await pool.query(
    `
    WITH base AS (
      SELECT
        COALESCE(SUM(
          CASE
            WHEN a.start_date >= NOW() - interval '7 days'
            THEN a.distance
            ELSE 0
          END
        ) / 1609.34, 0) AS acute_miles,

        COALESCE(SUM(
          CASE
            WHEN a.start_date >= NOW() - interval '28 days'
            THEN a.distance
            ELSE 0
          END
        ) / 1609.34, 0) AS total_28_day_miles

      FROM activities a
      WHERE a.athlete_id = $1
        AND a.type = 'Run'
        AND a.start_date >= NOW() - interval '28 days'
    )
    SELECT
      acute_miles AS acute_load,
      (total_28_day_miles / 4.0) AS chronic_load
    FROM base;
    `,
    [athleteId],
  );

  return rows[0];
};

/**
 * Get pace trend for the last 4 weeks
 * Returns array of { week, avg_speed, avg_pace }
 */
exports.getPaceTrend = async (athleteId, weeks) => {
  const { rows } = await pool.query(
    `
    WITH series AS (
      SELECT generate_series(
        date_trunc('week', NOW()) - interval '${weeks - 1} week',
        date_trunc('week', NOW()),
        interval '1 week'
      ) AS week
    )
    SELECT
      s.week,
      COALESCE(
        AVG(a.moving_time * 1609.34 / NULLIF(a.distance, 0)),
        NULL
      ) AS pace
    FROM series s
    LEFT JOIN activities a
      ON a.start_date >= s.week
      AND a.start_date < s.week + interval '1 week'
      AND a.athlete_id = $1
      AND a.type = 'Run'
    GROUP BY s.week
    ORDER BY s.week;
    `,
    [athleteId],
  );

  return rows;
};

exports.getHeatmapData = async (athleteId, metric) => {
  let valueColumn;
  switch (metric) {
    case "distance":
      valueColumn = "SUM(a.distance) / 1609.34";
      break;

    case "pace":
      valueColumn = "AVG(a.moving_time * 1609.34 / NULLIF(a.distance,0))";
      break;

    case "elevation":
      valueColumn = "SUM(a.total_elevation_gain)";
      break;

    case "effort":
      valueColumn = "AVG(a.average_heartrate)";
      break;

    default:
      valueColumn = "SUM(a.distance) / 1609.34";
  }

  const { rows } = await pool.query(
    `
    SELECT
      DATE(a.start_date) AS date,
      ${valueColumn} AS count
    FROM activities a
    WHERE a.athlete_id = $1
      AND a.type = 'Run'
      AND a.start_date >= NOW() - interval '1 year'
    GROUP BY DATE(a.start_date)
    ORDER BY date;
    `,
    [athleteId],
  );

  return rows;
};
