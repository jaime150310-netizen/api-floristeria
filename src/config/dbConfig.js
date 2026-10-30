require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const ca = process.env.DB_CA
    ? process.env.DB_CA.replace(/\\n/g, '\n')
    : fs.readFileSync(path.join(__dirname, '../../ca.pem'));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true,
    ssl: {
        ca: ca
    }
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("Conexion MYSQL exitosa");
});

module.exports = db;