const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {}

Category.init({

    _id: {

        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true

    },

    name: {

        type: DataTypes.STRING,
        allowNull: false

    },

    description: {

        type: DataTypes.STRING,

    },

}, {

    sequelize, paranoid: true, tableName: 'categories'

});

module.exports = Category