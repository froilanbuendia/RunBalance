CREATE TABLE weekly_goals (
    athlete_id BIGINT REFERENCES athletes(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,          -- start of the week (e.g., Monday)
    target_distance FLOAT NOT NULL,    -- goal for that week, e.g., 50 km
    PRIMARY KEY (athlete_id, week_start)
);

CREATE VIEW weekly_goal_progress AS
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