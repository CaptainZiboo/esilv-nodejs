const express = require('express');
const { v4 } = require('uuid');
const { checkAuth, checkAdmin } = require('../middleware/auth');
const route = express.Router();
const Comment = require('../models/comment');

route.post('/create', [checkAuth], async (req, res) => {
    
    const { content, post, reply } = req.body
    
    try {
        
        if( !content || !post ) {

            throw new Error('Merci de renseigner tous les champs')

        }

        const comment = await Comment.create({ _id: v4(), content, _owner: req.user._id, _post: post, _reply: reply })
        
        res.status(200).json({ message: 'Commentaire créé' })
        
    } catch (error) {
        
        res.status(400).json({ error: error.message })

    }

}) 

route.put('/update', [checkAuth, checkAdmin], async (req, res) => {

    const { _id, content } = req.body

    try {

        const comment = await Comment.findByPk(_id)

        if( !comment ) {

            throw new Error('Commentaire introuvable')

        }

        if( comment._owner !== req.user._id ) {

            throw new Error('Vous n\'êtes pas autorisé à modifier ce commentaire')

        }

        comment.set({ content: content })

        await comment.save()

        res.status(200).json({ message: 'Commentaire modifié' })

    } catch (error) {

        res.status(400).json({ error: error.message })  

    }

})
route.delete('/delete', [checkAuth, checkAdmin], async (req, res) => {

    const { _id } = req.body

    try {

        const comment = await Comment.findByPk(_id)

        if( !comment ) {

            throw new Error('Commentaire introuvable')

        }

        if( comment._owner !== req.user._id && !req.user.isAdmin ) {

            throw new Error('Vous n\'êtes pas autorisé à supprimer ce commentaire')

        }

        await comment.destroy()

        res.status(200).json({ message: 'Commentaire supprimé' })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.get('', async (req, res) => {
    
    const { post } = req.body

    try {

        const comments = await Comment.findAll({ where: { _post: post }, include: ['owner', 'replies'] })

        res.status(200).json({ comments })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

module.exports = route;