const express = require('express');
const { v4 } = require('uuid');
const { checkAuth, checkAdmin } = require('../middleware/auth');
const Category = require('../models/category');
const Post = require('../models/post');
const User = require('../models/user');
const route = express.Router();

// Création, modification et suppression d'une publication

route.post('/create', [checkAuth], async (req, res) => {
    
    const { categories, title, content } = req.body
    
    try {
        
        if( !categories || !title || !content ) {
            
            throw new Error('Merci de renseigner tous les champs')
            
        }
            
        // Création d'un identifiant unique
            
        const _id = v4();

        // Vérification de l'existence des catégories

        const invalidCategories = []
        const validCategories = categories.map(async (category) => {

            const exists = await Category.findByPk(category)

            if( !exists ) {

                invalidCategories.push(category)
                throw new Error('Catégorie introuvable')

            }

            return category

        })
        
        // Création de la publication en base de données

        const post = await Post.create({ _id, title, content, _owner: req.user._id, categories: categories, error: { invalidCategories } })

        res.send(post)

    } catch (error) {
        
        res.status(400).json({ error: error.message })

    }

})
route.post('/update', [checkAuth], async (req, res) => {

    const { _id, title, content } = req.body

    try {

        const post = await Post.findByPk(_id)

        if( !post ) {

            throw new Error('Publication introuvable')

        }

        if( post._owner !== req.user._id ) {

            throw new Error('Vous n\'êtes pas autorisé à modifier cette publication')

        }

        post.set({ title: title, content: content })
        await post.save()

        res.send(post)

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.post('/delete', [checkAuth, checkAdmin], async (req, res) => {

    const { _id } = req.body

    try {

        const post = await Post.findByPk(_id)

        if( !post ) {
            
            throw new Error('Publication introuvable')

        }

        if( post._owner !== req.user._id && !req.user.isAdmin ) {

            throw new Error('Vous n\'êtes pas autorisé à supprimer cette publication')

        } 

        await post.destroy()

        res.send({ message: 'Publication supprimée' })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

// Récupération des publications

route.get('', async (req, res) => {

    try {

        const posts = await Post.findAll({ include: ['owner', 'likedBy', 'comments'] })

        res.send(posts)

    } catch (error) {

        console.info(error)
        res.status(400).json({ error: error.message })

    }

})

// Ajout et suppression de likes

route.post('/like', [checkAuth], async (req, res) => {

    const { _id } = req.body

    try {

        const post = await Post.findByPk(_id)

        if( !post ) {
            
            throw new Error('Publication introuvable')

        }

        const user = await User.findByPk(req.user._id)

        if( !user ) {
            
            throw new Error('Utilisateur introuvable')

        }

        const like = await post.addLikedBy(user)

        res.status(200).json({ message: 'Like ajouté !' })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.post('/unlike', [checkAuth], async (req, res) => {

    const { _id } = req.body

    try {

        const post = await Post.findByPk(_id)

        if( !post ) {
            
            throw new Error('Publication introuvable')

        }

        const user = await User.findByPk(req.user._id)

        if( !user ) {
            
            throw new Error('Utilisateur introuvable')

        }

        const like = await post.removeLikedBy(user)

        res.status(200).json({ message: 'Like supprimé !' })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.use('/comments', require('./comments'))

module.exports = route