  CREATE TABLE chat_messages (
    id          SERIAL PRIMARY KEY,                                             
    athlete_id  INTEGER REFERENCES athletes(id) ON DELETE CASCADE,
    role        VARCHAR(10) NOT NULL,  -- 'user' or 'assistant'                 
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()                                       
  );     