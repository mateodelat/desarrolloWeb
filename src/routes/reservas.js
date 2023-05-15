const express = require('express');

const { DataStore, graphqlOperation, API } = require('aws-amplify');
const { listReservas } = require('../graphql/queries');




const reservaRouter = express.Router();

// Obtener todas las fechas de una aventura
reservaRouter.get('/', async (req, res) => {
    try {
        const { fechaID, usuarioID } = req.query

        if (!fechaID && !usuarioID) {
            throw new Error("Error, no se recibio el search param de fechaID o de usuarioID")
        }

        let response
        if (fechaID) {

            response = await API.graphql({
                query: listReservas, variables: {
                    filter: {
                        fechaID: { eq: fechaID }
                    }
                }
            })


        } else {
            response = await API.graphql({
                query: listReservas, variables: {
                    filter: {
                        usuarioID: { eq: usuarioID }
                    }
                }
            })
        }

        response = response.data.listReservas.items

        res.json(response);
    } catch (error) {
        console.log(error)
        let message = error.message
        if (error?.errors) {
            message = error.errors.reduce((prev, curr) => {
                return prev += curr.message + "\n"
            }, "")
        }

        res.status(404).send({ error: `${error.message}` })
    }

});


// Obtener una fecha especifica
reservaRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let product = await DataStore.query(Fecha, id)

        res.status(200).json(product);
    } catch (error) {
        console.log(error.message)

        res.status(404).send({ error: `${error.message}` })
    }

});

module.exports = reservaRouter;