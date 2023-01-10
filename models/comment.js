const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./post');
const User = require('./user');

class Comment extends Model {}

Comment.init({

    _id: {

        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true

    },

    date: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false

    },

    content: {

        type: DataTypes.STRING,

    },

}, {

    sequelize, paranoid: true, tableName: 'comments'

});

// Chaque commentaire a un propriétaire

User.hasMany( Comment, { as: 'comments', foreignKey: '_owner' })
Comment.belongsTo( User, { as: 'owner', foreignKey: '_owner' })

// Chaque commentaire est lié à une publication

Post.hasMany( Comment, { as: 'comments', foreignKey: '_post' })
Comment.belongsTo( Post, { as: 'post', foreignKey: '_post' })

// Chaque commentaire peut avoir des réponses

Comment.hasMany( Comment, { as: 'replies', foreignKey: '_reply' })
Comment.belongsTo( Comment, { as: 'parent', foreignKey: '_reply' })

module.exports = Comment