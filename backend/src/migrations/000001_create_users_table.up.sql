CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR NOT NULL,
  email       VARCHAR UNIQUE NOT NULL,
  password    VARCHAR NOT NULL,
  role_id     INTEGER NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

