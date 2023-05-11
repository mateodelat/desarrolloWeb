const express = require('express');

const { DataStore } = require('aws-amplify');
const { Aventura } = require('../models');




const aventuraRouter = express.Router();

// Obtener todos los productos
aventuraRouter.get('/', async (req, res) => {
    try {


        let products = await DataStore.query(Aventura)

        res.json(products);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(`${error.message}`)
    }

});


// Obtener un producto especifico
aventuraRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let product = await DataStore.query(Aventura, id)

        res.status(200).json(product);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(`${error.message}`)
    }

});

module.exports = aventuraRouter;