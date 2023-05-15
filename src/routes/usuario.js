const express = require('express');

const { DataStore } = require('aws-amplify');
const { Usuario } = require('../models');




const usuarioRouter = express.Router();

// Obtener un usuario especifico
usuarioRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let product = await DataStore.query(Usuario, id)

        res.status(200).json(product);
    } catch (error) {
        console.log(error.message)

        res.status(404).send({ error: `${error.message}` })
    }

});

module.exports = usuarioRouter;