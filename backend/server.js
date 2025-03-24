const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if(err){
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("MySQL database connected!");
});

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/api/v1/users", (req, res) => {
    db.query("SELECT * FROM user", (err, results) => {
        if(err){
            res.status(500).json(err);
            return;
        }
        res.status(200).json(results);
    });
});

app.get("/api/v1/data/getData", (req, res) => {
    const { lat, lng } = req.query;
    const query = `
    SELECT  * FROM (SELECT id, lat, lng, loc, water_table, bed_rock_level,
      (6371 * ACOS(
        COS(RADIANS(${lat})) * COS(RADIANS(lat)) 
        * COS(RADIANS(lng) - RADIANS(${lng})) 
        + SIN(RADIANS(${lat})) * SIN(RADIANS(lat))
      )) AS distance 
    FROM position_properties
    HAVING distance <= ${10} 
    ORDER BY distance ASC) AS data INNER JOIN soil_properties AS soil ON data.id = soil.position_properties_id;
  `;
  db.query(query, (err, results) => {
    if(err){
        res.status(500).json(err);
        return;
    }
    res.status(200).json(results);
  });
});

app.listen(5000, () => console.log("server is running on port 5000"));