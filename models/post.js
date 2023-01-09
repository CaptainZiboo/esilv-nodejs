const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Post extends Model {}

Post.init({

    _id: {

        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false

    },

    date: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false

    },

    title: {

        type: DataTypes.STRING,
        allowNull: false

    },

    content: {

        type: DataTypes.STRING,
        allowNull: false

    },

}, {

    sequelize, paranoid: true, tableName: 'posts'

});

module.exports = Post