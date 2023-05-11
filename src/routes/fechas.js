const express = require('express');

const { DataStore } = require('aws-amplify');
const { Aventura, Fecha } = require('../models');




const fechaRouter = express.Router();

// Obtener todas las fechas de una aventura
fechaRouter.get('/', async (req, res) => {
    try {
        const { aventuraID } = req.query

        if (!aventuraID) {
            throw new Error("Error, no se recibio el search param de aventuraID")
        }


        let data = await DataStore.query(Fecha, f => f.aventuraID.eq(aventuraID))

        res.json(data);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(`${error.message}`)
    }

});


// Obtener una fecha especifica
fechaRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let product = await DataStore.query(Fecha, id)

        res.status(200).json(product);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(`${error.message}`)
    }

});

module.exports = fechaRouter;