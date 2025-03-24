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

app.get("/users", (req, res) => {
    db.query("SELECT * FROM user", (err, results) => {
        if(err){
            res.status(500).json(err);
            return;
        }
        res.status(200).json(results);
    });
});

app.listen(5000, () => console.log("server is running on port 5000"));