const express = require('express');

const { DataStore, API, graphqlOperation } = require('aws-amplify');
const { Aventura, Fecha } = require('../models');
const { getFecha, listFechas } = require('../graphql/queries');




const fechaRouter = express.Router();

// Obtener todas las fechas de una aventura
fechaRouter.get('/', async (req, res) => {
    try {
        let response = await API.graphql(graphqlOperation(listFechas))

        response = response.data.listFechas.items


        if (response) {
            response = response.map(r => {
                return {
                    ...r,
                    Reservas: r.Reservas?.items
                }
            })

        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)

        res.status(404).send({ error: `${error.message}` })
    }

});


// Obtener una fecha especifica
fechaRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        let response = await API.graphql(graphqlOperation(getFecha, { id }))

        response = response.data.getFecha

        if (response) {
            response = {
                ...response,
                Reservas: response.Reservas?.items
            }

        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error.message)

        res.status(404).send({ error: `${error.message}` })
    }

});

module.exports = fechaRouter;