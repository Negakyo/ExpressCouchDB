const express = require("express");
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<p>L'API des livres est sur le /api</p>");
});

app.use('/api', require("./app/routers"))

app.listen(process.env.PORT || 5000, () => {
    console.log(`Le serveur est lancé sur le port : ${process.env.PORT || 5000}`);
});