CREATE DATABASE task_manager;
USE task_manager;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password VARCHAR(50),
  role VARCHAR(30)
);

select * from users;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  assigned_by VARCHAR(50),
  assigned_to VARCHAR(50),
  email VARCHAR(100),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20)
);

select * from tasks;

CREATE TABLE task_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    title VARCHAR(255),
    assigned_by VARCHAR(50),
    assigned_to VARCHAR(50),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by VARCHAR(50),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


