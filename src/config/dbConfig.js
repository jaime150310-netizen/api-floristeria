require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, '../../ca.pem'))
    }
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Conexion MYSQL exitosa");
});

module.exports = db;