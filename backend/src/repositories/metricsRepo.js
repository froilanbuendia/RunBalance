const { pool } = require("../database/db");

/**
 * Get weekly mileage for the most recent week
 * Returns { week, miles }
 */
exports.getWeeklyMileage = async (athleteId) => {
  const { rows } = await pool.query(
    `
    WITH last_week AS (
      SELECT date_trunc('week', NOW()) AS week
    )
    SELECT lw.week,
           COALESCE(SUM(a.distance)/1609.34, 0) AS miles
    FROM last_week lw
    LEFT JOIN activities a
      ON date_trunc('week', a.start_date) = lw.week
     AND a.athlete_id = $1
     AND a.type = 'Run'
    GROUP BY lw.week;
    `,
    [athleteId]
  );

  return rows[0];
};

/**
 * Get rolling 4-week average, last 4 weeks including current week
 * Returns array of weeks with miles + rolling 4wk average
 */
exports.getRollingFourWeekAverage = async (athleteId) => {
  const { rows } = await pool.query(
    `
    WITH last_4_weeks AS (
      SELECT generate_series(
               date_trunc('week', NOW()) - interval '3 weeks',
               date_trunc('week', NOW()),
               interval '1 week'
             ) AS week
    ),
    weekly AS (
      SELECT
        lw.week,
        COALESCE(SUM(a.distance)/1609.34, 0) AS miles
      FROM last_4_weeks lw
      LEFT JOIN activities a
        ON date_trunc('week', a.start_date) = lw.week
       AND a.athlete_id = $1
       AND a.type = 'Run'
      GROUP BY lw.week
    )
    SELECT week,
           miles,
           AVG(miles) OVER () AS rolling_4wk_avg
    FROM weekly
    ORDER BY week;
    `,
    [athleteId]
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
    [athleteId]
  );

  return rows;
};

/**
 * Get pace trend for the last 4 weeks
 * Returns array of { week, avg_speed, avg_pace }
 */
exports.getPaceTrend = async (athleteId) => {
  const { rows } = await pool.query(
    `
      WITH last_4_weeks AS (
        SELECT generate_series(
                 date_trunc('week', NOW()) - interval '3 weeks',
                 date_trunc('week', NOW()),
                 interval '1 week'
               ) AS week
      ),
      weekly AS (
        SELECT
          lw.week,
          COALESCE(AVG(a.moving_time / (a.distance/1609.34)), 0) AS avg_seconds_per_mile
        FROM last_4_weeks lw
        LEFT JOIN activities a
          ON date_trunc('week', a.start_date) = lw.week
         AND a.athlete_id = $1
         AND a.type = 'Run'
        GROUP BY lw.week
      )
      SELECT
        week,
        TO_CHAR(MAKE_INTERVAL(secs => avg_seconds_per_mile), 'MI:SS') AS avg_pace
      FROM weekly
      ORDER BY week;
      `,
    [athleteId]
  );

  return rows;
};

/**
 * Get acute/chronic load (ACWR) for last 4 weeks
 * Handles weeks with no runs
 * Returns { acute_load, chronic_load, acwr }
 */
exports.getAcuteChronicLoad = async (athleteId) => {
  const { rows } = await pool.query(
    `
    WITH last_4_weeks AS (
      SELECT generate_series(
               date_trunc('week', NOW()) - interval '3 weeks',
               date_trunc('week', NOW()),
               interval '1 week'
             ) AS week
    ),
    weekly AS (
      SELECT
        lw.week,
        COALESCE(SUM(a.distance)/1609.34, 0) AS miles
      FROM last_4_weeks lw
      LEFT JOIN activities a
        ON date_trunc('week', a.start_date) = lw.week
       AND a.athlete_id = $1
       AND a.type = 'Run'
      GROUP BY lw.week
    )
    SELECT
      (SELECT miles FROM weekly ORDER BY week DESC LIMIT 1) AS acute_load,
      (SELECT AVG(miles) FROM weekly) AS chronic_load,
      (SELECT miles FROM weekly ORDER BY week DESC LIMIT 1) /
        NULLIF((SELECT AVG(miles) FROM weekly), 0) AS acwr
    FROM weekly
    LIMIT 1;
    `,
    [athleteId]
  );

  return rows[0];
};
