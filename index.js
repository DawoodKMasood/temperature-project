const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

require('dotenv').config();

// MySQL connection settings
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

app.use(express.static('public'));

app.get('/latest', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM temperature ORDER BY timestamp DESC LIMIT 1');

        if (rows.length === 0) {
            res.status(404).json({ error: 'No temperature data found' });
            return;
        }

        res.status(200).json(rows[0]);
        await connection.end();
    } catch (error) {
        console.error('Database error:', error.message);
        res.status(500).json({ error: 'Error fetching temperature data', message: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});