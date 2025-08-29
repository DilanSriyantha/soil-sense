CREATE DATABASE IF NOT EXISTS soilsensedb;
USE soilsensedb;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE position_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat DOUBLE,
    lng DOUBLE,
    loc VARCHAR(50),
    water_table FLOAT,
    bed_rock_level FLOAT
);

CREATE TABLE soil_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    depth_range VARCHAR(50),
    description TEXT
    bh_id INT,
);

CREATE TABLE bh_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bh_number INT,
    position_prop_id INT
);