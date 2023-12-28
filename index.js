const express = require('express');
const admin = require('firebase-admin');
var serviceAccount = require("./temperature-project.json");
const app = express();
const port = 3000;

require('dotenv').config();

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.static('public'));

const db = admin.firestore();

app.get('/latest', async (req, res) => {
    try {
        const temperatureRef = db.collection('temperature');
        const latestSnapshot = await temperatureRef.orderBy('timestamp', 'desc').limit(1).get();

        if (latestSnapshot.empty) {
            res.status(404).json({ error: 'No temperature data found' });
            return;
        }

        latestSnapshot.forEach(doc => {
            res.status(200).json(doc.data());
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching temperature data', message: error.message });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});