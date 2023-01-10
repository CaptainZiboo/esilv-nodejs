const express = require('express');
const route = express.Router();

// Ajout des routes

route.use('/auth', require('./auth'));

module.exports = route;