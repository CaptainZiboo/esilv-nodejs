require('dotenv').config()

const express = require('express')
const sequelize = require('./config/database')
const routes = require('./routes')

// Création de l'application express

const app = express()

app.use(express.json())
app.use(express.urlencoded({

    extended: true

}))

// Ajout des routes

app.use('/api', routes)

// Lancement du serveur

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Serveur connnecté sur le port ${port}`));

sequelize.sync({ force: true })