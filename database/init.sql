CREATE DATABASE IF NOT EXISTS soilsensedb;
USE soilsensedb;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE position_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat FLOAT,
    lng FLOAT,
    loc VARCHAR(50),
    water_table FLOAT,
    bed_rock_level FLOAT
);

INSERT INTO position_properties (lat, lng, loc, water_table, bed_rock_level) VALUES (6.878302, 79.857023, "", 2.80, 0), (6.878764, 79.85233, "", 2.60, 17.00);

CREATE TABLE soil_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    position_properties_id INT,
    depth_range VARCHAR(50),
    description TEXT
);

INSERT INTO soil_properties (position_properties_id, depth_range, description) VALUES (1, "0.00-0.20m", "Pale Brownish Fine Grained SAND"), (1, "2.00-3.00m", "Pale Brownish Fine Grained SAND with some Sea Shells"), (1, "3.00-8.20m", "Pale Brownish Fine to Medium Grained sand with Sea shells"), (1, "8.00-9.50m", "Brownish Grey Coarse Grained sand"), (1, "9.50-10.00m", "Brownish Grey Fine to Coarse Grained SAND"), (2, "0.00-0.30m", "Building Debris"), (2, "0.30-3.00m", "Pale Brownish Fine to Medium Grained SAND"), (2, "3.00-4.00m", "Pale Brownish Fine to Coarse Grained SAND with some Sea Shells"), (2, "4.00-6.50m", "c"), (2, "6.50-8.00m", "Pale Vrownish Fine to Coarse Grained SAND with Sea Shells"), (2, "8.00-9.50m", "Brownish Grey Fine Grained SAND"), (2, "9.50-10.00m", "Pale Brownish Fine to Coarse Grained SAND"), (2, "10.00-12.50m","Pale Brownish Coarse Grained SAND with Sea Shells"), (2, "12.50-14.00m","Black Peat With Blach Coarse Grained SAND"), (2, "14.00-15.50m", "Grey Coarse Grained SILTY SAND"), (2, "15.50-17.00m", "Grey Fine Grained SILTY SAND
"), (2, "17.00-20.00m", "Black White Cream COMPLETELY WEATHERED ROCK
");

INSERT INTO user (name) VALUES ("Alice"), ("Bob"), ("Charlie");