CREATE DATABASE IF NOT EXISTS soilsensedb;
USE soilsensedb;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

INSERT INTO user (name) VALUES ("Alice"), ("Bob"), ("Charlie");