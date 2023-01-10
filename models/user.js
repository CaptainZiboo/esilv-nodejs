const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {}

User.init({

    _id: {

        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true

    },

    username: {

        type: DataTypes.STRING,
        allowNull: false

    },

    email: {

        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },

    password: {

        type: DataTypes.STRING,
        allowNull: false

    },

    role: {

        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {

            isIn: [['user', 'admin']]

        }

    }

}, {

    sequelize, paranoid: true, tableName: 'users'

});

User.beforeCreate( async (user) => {

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash;

});

module.exports = User