const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')
const { 
    
    createAccessToken, 
    createRefreshToken, 
    verifyRefreshToken

} = require('../services/token')

const route = express.Router()

// Inscription

route.post('/register', async (req, res) => {

    const { username, email, password } = req.body

    try {
        
        if( !username || !email || !password ) {

            throw new Error('Merci de renseigner tous les champs')

        }

        const exists = await User.findOne({ where: { email } })

        if( exists ) {

            return res.status(400).json({ error: 'Cet email est déjà utilisé' })

        }

        // Création d'un identifiant unique

        const _id = v4();

        // Création de l'utilisateur en base de données

        const user = await User.create({ _id, username, email, password })
    
        // Création du token d'authentification

        const accessToken = createAccessToken({ user: {

            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }})
        const refreshToken = createRefreshToken({ _id: user._id })

        // Envoi de la réponse à l'utilisateur

        res.cookie('refreshToken', refreshToken, { httpOnly: true })
        res.status(200).json({ user: {

            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }, token: accessToken })

    } catch (error) {

        console.info(error)
        res.status(400).json({ error: error.message })
        
    }

})

// Connexion

route.post('/login', async (req, res) => {

    const { email, password } = req.body

    try {

        if( !email || !password ) {

            throw new Error('Merci de renseigner les champs nécessaires')
    
        }
    
        const user = await User.findOne({ where: { email } })
    
        if( !user ) {
    
            throw new Error('L\'utilisateur n\'existe pas !')
    
        }
        
        const pass = await bcrypt.compare( password, user.password)

        if( !pass ) {

            throw new Error('Mot de passe incorrect')

        }

        // Création des token d'authentification

        const accessToken = createAccessToken({ user: {

            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }})
        const refreshToken = createRefreshToken({ _id: user._id })
        
        // Envoi de la réponse à l'utilisateur

        res.cookie('refreshToken', refreshToken, { httpOnly: true })
        res.status(200).json({ user: {

            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }, token: accessToken })
    
    } catch (error) {   
        
        console.info(error)
        res.status(400).json({ error: error.message })
        
    }

})

// Déconnexion

route.post('/logout', (req, res) => {
    
    // Suppression du cookie refreshToken

    res.clearCookie('refreshToken')

    // Envoi de la réponse à l'utilisateur
    
    res.status(200).json({ message: 'Déconnexion réussie' })

})

// Récupération des informations de l'utilisateur connecté

route.get('', async (req, res) => {
    
    const refreshToken = req.cookies.refreshToken

    if( !refreshToken ) {

        return res.status(400).json({ error: 'Vous devez être connecté !' })

    }

    try {
        
        const { _id } = verifyRefreshToken(refreshToken)

        const user = await User.findByPk(_id)

        if( !user ) {

            throw new Error('Utilisateur introuvable')

        }

        const accessToken = createAccessToken({ user: {

            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }})
        
        res.status(200).json({ user: {

            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role

        }, token: accessToken })

    } catch (error) {

        console.info(error)
        res.status(400).json({ error: error.message })

    }

})

module.exports = route