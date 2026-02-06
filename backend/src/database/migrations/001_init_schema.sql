CREATE TABLE athletes (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    firstname TEXT,
    lastname TEXT,
    profile TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
  
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_expires_at TIMESTAMP NOT NULL,
  
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE TABLE gear (
    id TEXT PRIMARY KEY,
    athlete_id BIGINT REFERENCES athletes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    distance FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE TABLE activities (
    id BIGINT PRIMARY KEY,
    athlete_id BIGINT REFERENCES athletes(id) ON DELETE CASCADE,
  
    name TEXT,
    type TEXT NOT NULL,
    distance FLOAT NOT NULL,
    moving_time INT NOT NULL,
    elapsed_time INT NOT NULL,
    total_elevation_gain FLOAT NOT NULL,
  
    start_date TIMESTAMP NOT NULL,
    timezone TEXT,
  
    average_speed FLOAT NOT NULL,
    max_speed FLOAT NOT NULL,
    average_heartrate FLOAT,
    max_heartrate FLOAT,
  
    gear_id TEXT REFERENCES gear(id),
    created_at TIMESTAMP DEFAULT NOW()
  );
  
  CREATE INDEX idx_activities_athlete_date
  ON activities (athlete_id, start_date);
  
  CREATE TABLE splits (
    activity_id BIGINT REFERENCES activities(id) ON DELETE CASCADE,
    split_number INT,
  
    distance FLOAT NOT NULL,
    elapsed_time INT NOT NULL,
    moving_time INT NOT NULL,
    average_speed FLOAT NOT NULL,
    pace_zone INT NOT NULL,
  
    PRIMARY KEY (activity_id, split_number)
  );
  
  CREATE TABLE activity_summaries (
    athlete_id BIGINT REFERENCES athletes(id) ON DELETE CASCADE,
    period TEXT,
    period_start DATE,
  
    total_distance FLOAT NOT NULL,
    total_time INT NOT NULL,
    total_activities INT NOT NULL,
  
    PRIMARY KEY (athlete_id, period, period_start)
  );
  
  CREATE TABLE heart_rate_zones (
    athlete_id BIGINT REFERENCES athletes(id) ON DELETE CASCADE,
    zone INT,
    min_hr INT,
    max_hr INT,
  
    PRIMARY KEY (athlete_id, zone)
  );
  