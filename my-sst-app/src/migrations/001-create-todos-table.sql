-- migrations/001_create_todos_table.sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(64) NOT NULL,
    todo TEXT NOT NULL,
    btc DECIMAL(18, 8) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);
