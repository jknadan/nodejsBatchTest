const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '',
    database: 'test'
});

module.exports = {
    pool: pool
};