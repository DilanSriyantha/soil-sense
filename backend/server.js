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
    if (err) {
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
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.status(200).json(results);
    });
});

app.get("/api/v1/data/getData", (req, res) => {
    const { lat, lng } = req.query;
    const query = `
        SELECT *
        FROM (
        SELECT 
            id, lat, lng, loc, water_table, bed_rock_level,
            (
            6371000 * ACOS(
                COS(RADIANS(${lat})) * COS(RADIANS(lat)) *
                COS(RADIANS(${lng}) - RADIANS(lng)) +
                SIN(RADIANS(${lat})) * SIN(RADIANS(lat))
            )
            ) AS distance
        FROM position_properties
        ) AS data
        INNER JOIN soil_properties AS soil
        ON data.id = soil.position_properties_id
        WHERE distance <= ${10}
        ORDER BY distance ASC;
  `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        const resultData = [];
        let counter = 0;
        results.forEach(r => {
            let nextIdx = 0;

            if (resultData.length > 0)
                nextIdx = resultData.length;

            if (nextIdx !== 0 && resultData[nextIdx - 1].lat === r.lat && resultData[nextIdx - 1].lng === r.lng) {
                resultData[nextIdx - 1]["soil_properties"].push({ id: ++counter, depth_range: r.depth_range, description: r.description });
            } else {
                counter = 0;
                resultData[nextIdx] = {
                    id: Math.random(),
                    lat: r.lat,
                    lng: r.lng,
                    loc: r.loc,
                    water_table: r.water_table,
                    bed_rock_level: r.bed_rock_level,
                    soil_properties: [{ id: ++counter, depth_range: r.depth_range, description: r.description }]
                };
            }
        });

        res.status(200).json(resultData);
    });
});

app.post("/api/v1/data/insert", (req, res) => {
    const { latitude, longitude, location, water_table, bed_rock_level, soil_properties } = req.body;

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction error: ", err);
            return res.sendStatus(500);
        }

        const position_properties_query = `
            INSERT INTO position_properties (lat, lng, loc, water_table, bed_rock_level) VALUES (?, ?, ?, ?, ?)
        `;

        db.query(position_properties_query, [latitude, longitude, location, water_table, bed_rock_level], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Insert position error: ", err);
                    res.sendStatus(500);
                });
            }

            const position_properties_insert_id = result.insertId;

            if (!soil_properties || soil_properties.length === 0) {
                return db.commit(err => {
                    if (err)
                        return db.rollback(() => res.sendStatus(500));

                    res.json({ status: 200, message: "Successful (no soil properties data)" });
                });
            }

            const soil_properties_query = `
                INSERT INTO soil_properties (position_properties_id, depth_range, description) VALUES ?
            `;

            const soil_properties_values = soil_properties.map(row => [
                position_properties_insert_id,
                row.depth_range,
                row.description
            ]);

            db.query(soil_properties_query, [soil_properties_values], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Insert soil error: ", err);
                        res.sendStatus(500);
                    });
                }

                db.commit(err => {
                    if (err)
                        return db.rollback(() => res.sendStatus(500));

                    res.json({ status: 200, message: "Successful" });
                });
            });
        })
    })
});

app.get("/api/v1/data/getNearbyData", (req, res) => {
    const { lat, lng } = req.query;

    // fetch data within 1Km radius
    const query = `
        SELECT *
        FROM (
        SELECT 
            id, lat, lng, loc, water_table, bed_rock_level,
            (
            6371 * ACOS(
                COS(RADIANS(${lat})) * COS(RADIANS(lat)) *
                COS(RADIANS(${lng}) - RADIANS(lng)) +
                SIN(RADIANS(${lat})) * SIN(RADIANS(lat))
            )
            ) AS distance
        FROM position_properties
        ) AS data
        INNER JOIN soil_properties AS soil
        ON data.id = soil.position_properties_id
        WHERE distance <= ${1}
        ORDER BY distance ASC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        const resultData = [];
        let counter = 0;
        results.forEach(r => {
            let nextIdx = 0;

            if (resultData.length > 0)
                nextIdx = resultData.length;

            if (nextIdx !== 0 && resultData[nextIdx - 1].lat === r.lat && resultData[nextIdx - 1].lng === r.lng) {
                resultData[nextIdx - 1]["soil_properties"].push({ id: ++counter, depth_range: r.depth_range, description: r.description });
            } else {
                counter = 0;
                resultData[nextIdx] = {
                    id: Math.random(),
                    lat: r.lat,
                    lng: r.lng,
                    loc: r.loc,
                    water_table: r.water_table,
                    bed_rock_level: r.bed_rock_level,
                    soil_properties: [{ id: ++counter, depth_range: r.depth_range, description: r.description }]
                };
            }
        });

        res.status(200).json(resultData);
    });
});

app.listen(5000, () => console.log("server is running on port 5000"));