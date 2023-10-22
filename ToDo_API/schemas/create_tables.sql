-- creating the users table
CREATE TABLE IF NOT EXISTS users(

    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL  -- store a hashed password, not plain text
);

-- creating the lists table
CREATE TABLE IF NOT EXISTS lists(
    list_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    list_name VARCHAR(255) NOT NULL
);

-- creating the tasks table
CREATE TABLE IF NOT EXISTS tasks(
    task_id SERIAL PRIMARY KEY,
    list_id INTEGER REFERENCES lists(list_id) ON DELETE CASCADE,
    parent_task_id INTEGER REFERENCES tasks(task_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    is_collapsed BOOLEAN DEFAULT FALSE
);
