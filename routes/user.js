const express = require('express')
const { checkRole, checkAuth } = require('../middleware/auth')
const User = require('../models/user')
const route = express.Router()

route.get('', [ checkAuth, checkRole('admin')], async (req, res) => {

    try {
        
        const users = await User.findAll()

        res.status(200).json(users)

    } catch (error) {

        console.info(error)
        res.status(500).json({ error: error.message })

    }

})

route.get('/:id', [ checkAuth, checkRole('admin')], async (req, res) => {

    const { id } = req.params

    try {
        
        const user = await User.findOne({ where: { _id: id } })

        res.status(200).json({
            
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        })

    } catch (error) {

        res.status(500).json({ error: error.message })

    }

})

module.exports = route;