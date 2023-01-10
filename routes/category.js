const express = require('express')
const { v4 } = require('uuid')
const { checkRole, checkAuth } = require('../middleware/auth')
const Category = require('../models/category')

const route = express.Router()

route.post('/create', [checkAuth, checkRole('admin')], async (req, res) => {
  
    const { name, description } = req.body

    try {

        if( !name ) {

            throw new Error('Merci de renseigner tous les champs')

        }

        const category = await Category.create({ _id: v4(), name, description })

        res.status(200).json({ message: 'Catégorie créée', category })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.put('/update', [checkAuth, checkRole('admin')], async (req, res) => {

    const { _id, name, description } = req.body

    try {

        const category = await Category.findByPk(_id)

        if( !category ) {

            throw new Error('Catégorie introuvable')

        }

        category.set({ name, description })

        await category.save()

        res.status(200).json({ message: 'Catégorie modifiée' })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.delete('/delete', [checkAuth, checkRole('admin')], async (req, res) => {

    const { _id } = req.body

    try {

        const category = await Category.findByPk(_id)

        if( !category ) {

            throw new Error('Catégorie introuvable')

        }

        await category.destroy()

        res.status(200).json({ message: 'Catégorie supprimée' })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

route.get('', async (req, res) => {
    
    try {
        
        const categories = await Category.findAll()
        
        res.status(200).json({ categories })

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

})

module.exports = route;