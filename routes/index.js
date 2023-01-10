const express = require('express');
const route = express.Router();

// Ajout des routes

route.use('/auth', require('./auth'));
route.use('/users', require('./user'));
route.use('/posts', require('./post'));
route.use('/categories', require('./categories'));

module.exports = route;