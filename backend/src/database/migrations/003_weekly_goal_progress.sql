CREATE OR REPLACE VIEW weekly_goal_progress AS
SELECT 
    g.athlete_id,
    g.week_start,
    g.target_distance,
    COALESCE(SUM(a.distance), 0) AS completed_distance
FROM weekly_goals g
LEFT JOIN activities a
    ON a.athlete_id = g.athlete_id
    AND a.start_date >= g.week_start
    AND a.start_date < g.week_start + INTERVAL '7 days'
GROUP BY g.athlete_id, g.week_start, g.target_distance;