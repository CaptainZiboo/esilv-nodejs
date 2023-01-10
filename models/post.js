const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./category');
const User = require('./user');

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

// Chaque publication a un propriétaire

User.hasMany( Post, { as: 'posts', foreignKey: '_owner' })
Post.belongsTo( User, { as: 'owner', foreignKey: '_owner' })

// Chaque publication a plusieurs likes

User.belongsToMany( Post, { through: 'likes', as: 'likedPosts' })
Post.belongsToMany( User, { through: 'likes', as: 'likedBy' })

// Chaque publication est dans une ou plusieurs catégories

Category.belongsToMany( Post, { through: 'tags', as: 'posts' }) 
Post.belongsToMany( Category, { through: 'tags', as: 'categories' })

module.exports = Post