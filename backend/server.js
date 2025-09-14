const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const TerzhagiCalc = require("./terzhagi_calculator");
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
    //     const query = `
    //         SELECT *
    //         FROM (
    //         SELECT 
    //             id, lat, lng, loc, water_table, bed_rock_level,
    //             (
    //             6371000 * ACOS(
    //                 COS(RADIANS(${lat})) * COS(RADIANS(lat)) *
    //                 COS(RADIANS(${lng}) - RADIANS(lng)) +
    //                 SIN(RADIANS(${lat})) * SIN(RADIANS(lat))
    //             )
    //             ) AS distance
    //         FROM position_properties
    //         ) AS data
    //         INNER JOIN soil_properties AS soil
    //         ON data.id = soil.position_properties_id
    //         WHERE distance <= ${10}
    //         ORDER BY distance ASC;
    //   `;

    const query = `
        SELECT 
            data.id AS position_id,
            data.lat,
            data.lng,
            data.loc,
            data.water_table,
            data.bed_rock_level,
            data.distance,

            bh.id AS bh_info_id,
            bh.bh_number,

            sp.id AS soil_property_id,
            sp.depth_range,
            sp.description

        FROM (
            SELECT 
                pp.id,
                pp.lat,
                pp.lng,
                pp.loc,
                pp.water_table,
                pp.bed_rock_level,
                (
                    6371000 * ACOS(
                        COS(RADIANS(${lat})) * COS(RADIANS(pp.lat)) *
                        COS(RADIANS(${lng}) - RADIANS(pp.lng)) +
                        SIN(RADIANS(${lat})) * SIN(RADIANS(pp.lat))
                    )
                ) AS distance
            FROM position_properties pp
        ) AS data

        JOIN bh_info bh ON bh.position_prop_id = data.id
        JOIN soil_properties sp ON sp.bh_id = bh.id

        WHERE data.distance <= 10
        ORDER BY data.distance ASC, bh.bh_number, sp.depth_range;
    `;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        // const resultData = [];
        // let counter = 0;
        // results.forEach(r => {
        //     let nextIdx = 0;

        //     if (resultData.length > 0)
        //         nextIdx = resultData.length;

        //     if (nextIdx !== 0 && resultData[nextIdx - 1].lat === r.lat && resultData[nextIdx - 1].lng === r.lng) {
        //         resultData[nextIdx - 1]["bh_info"].push({
        //             id: Math.random(), number: r.bh_number, soil_properties: results.map(row => {
        //                 return {
        //                     id: row.soil_property_id,
        //                     depth_range: row.depth_range,
        //                     description: row.description
        //                 }
        //             })
        //         });
        //     } else {
        //         counter = 0;
        //         resultData[nextIdx] = {
        //             id: Math.random(),
        //             lat: r.lat,
        //             lng: r.lng,
        //             loc: r.loc,
        //             water_table: r.water_table,
        //             bed_rock_level: r.bed_rock_level,
        //             bh_info: [
        //                 {
        //                     id: Math.random(),
        //                     number: r.bh_number,
        //                     soil_properties: results.map(row => {
        //                         return {
        //                             id: row.soil_property_id,
        //                             depth_range: row.depth_range,
        //                             description: row.description
        //                         }
        //                     })
        //                 }
        //             ]
        //         };
        //     }
        // });

        const constructSoilPropertiesObject = (sp_idx = 0, bh_id, soil_properties) => {
            if (sp_idx >= results.length) return;

            if (!soil_properties)
                soil_properties = [];

            if (results[sp_idx].bh_info_id === bh_id) {
                soil_properties.push({
                    id: Math.random(),
                    depth_range: results[sp_idx].depth_range,
                    description: results[sp_idx].description,
                });
            }

            constructSoilPropertiesObject(++sp_idx, bh_id, soil_properties);
            return soil_properties;
        };

        const constructBHInfoObject = (bh_idx = 0, position_id, bh_info) => {
            if (bh_idx >= results.length) return;

            if (bh_idx > 0 && results[bh_idx - 1].bh_info_id === results[bh_idx].bh_info_id)
                return constructBHInfoObject(++bh_idx, position_id, bh_info);

            if (!bh_info)
                bh_info = [];

            if (results[bh_idx].position_id === position_id) {
                bh_info.push({
                    id: results[bh_idx].bh_info_id,
                    number: results[bh_idx].bh_number,
                    soil_properties: constructSoilPropertiesObject(0, results[bh_idx].bh_info_id),
                });
            }

            constructBHInfoObject(++bh_idx, position_id, bh_info);
            return bh_info;
        };

        const constructPositionObject = () => {
            if (results.length > 0) {
                return {
                    id: Math.random(),
                    lat: results[0].lat,
                    lng: results[0].lng,
                    loc: results[0].loc,
                    water_table: results[0].water_table,
                    bed_rock_level: results[0].bed_rock_level,
                    bh_info: constructBHInfoObject(0, results[0].position_id),
                };
            }
            return {};
        };

        const resultData = constructPositionObject();

        res.status(200).json(resultData);
    });
});

app.post("/api/v1/data/insert", (req, res) => {
    const { latitude, longitude, location, water_table, bed_rock_level, bh_info } = req.body;

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

            if (!bh_info || bh_info.length === 0) {
                return db.commit(err => {
                    if (err)
                        return db.rollback(() => res.sendStatus(500));
                    res.json({ status: 200, message: "Successful (no soil properties data)" });
                });
            }

            const insertBh = (index = 0) => {
                if (index >= bh_info.length) {
                    return db.commit(err => {
                        if (err)
                            return db.rollback(() => res.sendStatus(500));
                        res.json({ status: 200, message: "Successfull" });
                    });
                }

                const bh = bh_info[index];

                const bh_info_query = `
                    INSERT INTO bh_info (bh_number, position_prop_id) VALUES (?, ?)
                `;

                db.query(bh_info_query, [bh.number, position_properties_insert_id], (err, bhResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Insert bh_info error: ", err);
                            res.sendStatus(500);
                        });
                    }

                    const bh_info_insert_id = bhResult.insertId;

                    const soil_properties_query = `
                        INSERT INTO soil_properties (depth_range, description, bh_id) VALUES ?
                    `;

                    const soil_properties = bh.soil_properties || [];
                    if (soil_properties.length === 0)
                        return insertBh(index + 1);

                    const soil_properties_values = soil_properties.map(row => [
                        row.depth_range,
                        row.description,
                        bh_info_insert_id
                    ]);

                    db.query(soil_properties_query, [soil_properties_values], err => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Insert soil error: ", err);
                                res.sendStatus(500);
                            });
                        }

                        insertBh(index + 1);
                    });
                });
            };

            insertBh();
        });
    });
});

app.get("/api/v1/data/getNearbyData", (req, res) => {
    const { lat, lng } = req.query;

    // fetch data within 1Km radius
    const query = `
        SELECT 
            data.id AS position_id,
            data.lat,
            data.lng,
            data.loc,
            data.water_table,
            data.bed_rock_level,
            data.distance,

            bh.id AS bh_info_id,
            bh.bh_number,

            sp.id AS soil_property_id,
            sp.depth_range,
            sp.description

        FROM (
            SELECT 
                pp.id,
                pp.lat,
                pp.lng,
                pp.loc,
                pp.water_table,
                pp.bed_rock_level,
                (
                    6371 * ACOS(
                        COS(RADIANS(${lat})) * COS(RADIANS(pp.lat)) *
                        COS(RADIANS(${lng}) - RADIANS(pp.lng)) +
                        SIN(RADIANS(${lat})) * SIN(RADIANS(pp.lat))
                    )
                ) AS distance
            FROM position_properties pp
        ) AS data

        JOIN bh_info bh ON bh.position_prop_id = data.id
        JOIN soil_properties sp ON sp.bh_id = bh.id

        WHERE data.distance <= 1
        ORDER BY data.distance ASC, bh.bh_number, sp.depth_range;
    `;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }

        const constructSoilPropertiesObject = (sp_idx = 0, bh_id, soil_properties) => {
            if (sp_idx >= results.length) return;

            if (!soil_properties)
                soil_properties = [];

            if (results[sp_idx].bh_info_id === bh_id) {
                soil_properties.push({
                    id: Math.random(),
                    depth_range: results[sp_idx].depth_range,
                    description: results[sp_idx].description,
                });
            }

            constructSoilPropertiesObject(++sp_idx, bh_id, soil_properties);
            return soil_properties;
        };

        const constructBHInfoObject = (bh_idx = 0, position_id, bh_info) => {
            if (bh_idx >= results.length) return;

            if (bh_idx > 0 && results[bh_idx - 1].bh_info_id === results[bh_idx].bh_info_id)
                return constructBHInfoObject(++bh_idx, position_id, bh_info);

            if (!bh_info)
                bh_info = [];

            if (results[bh_idx].position_id === position_id) {
                bh_info.push({
                    id: results[bh_idx].bh_info_id,
                    number: results[bh_idx].bh_number,
                    soil_properties: constructSoilPropertiesObject(0, results[bh_idx].bh_info_id),
                });
            }

            constructBHInfoObject(++bh_idx, position_id, bh_info);
            return bh_info;
        };

        const constructPositionObject = (p_idx, position_properties) => {
            if (p_idx >= results.length) return;

            if (p_idx > 0 && results[p_idx - 1].position_id === results[p_idx].position_id)
                return constructPositionObject(++p_idx, position_properties);

            if (!position_properties)
                position_properties = [];

            if (results.length > 0) {
                position_properties.push({
                    id: Math.random(),
                    lat: results[p_idx].lat,
                    lng: results[p_idx].lng,
                    loc: results[p_idx].loc,
                    water_table: results[p_idx].water_table,
                    bed_rock_level: results[p_idx].bed_rock_level,
                    bh_info: constructBHInfoObject(0, results[p_idx].position_id),
                });
            }

            constructPositionObject(++p_idx, position_properties);
            return position_properties;
        };

        const resultData = constructPositionObject(0);

        res.status(200).json(resultData);
    });
});

app.post("/api/v1/data/terzhagi", (req, res) => {
    // const params = { c: 25, gamma: 10, phi: 30, applied_load: 1500, FS: 3, t_conc: 0.3 };

    const params = req.body;

    const options = TerzhagiCalc.generate_options(
        params.c,
        params.gamma,
        params.phi,
        params.applied_load,
        params.FS,
        params.t_conc
    );

    const bestOptions = {
        Square: TerzhagiCalc.pick_best(options.Square, 2),
        Strip: TerzhagiCalc.pick_best(options.Strip, 2),
        Rectangular: TerzhagiCalc.pick_best(options.Rectangular)
    };

    res.status(200).json(bestOptions);
});

app.listen(5000, () => console.log("server is running on port 5000"));