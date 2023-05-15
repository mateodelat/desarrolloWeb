const express = require('express');

const { DataStore, graphqlOperation, API } = require('aws-amplify');
const { listReservas } = require('../graphql/queries');
const { createReserva } = require('../graphql/mutations');
const { v4: uuidv4 } = require('uuid');




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

// Crear una reserva
// Crear una aventura
reservaRouter.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "El no se recibio cuerpo de la solicitud" });
        }

        // Validate input data
        let { comisionFecha, guiaID, fechaID, total, usuarioID, adultos, ninos, tercera } = req.body;

        // Sacar el pagado al guia del total menos la comision
        const pagadoAlGuia = total / (1 + comisionFecha)
        const comision = total - pagadoAlGuia



        if (!comisionFecha) {
            return res.status(400).json({ error: "El comisionFecha es requerido" });
        }

        if (!guiaID) {
            return res.status(400).json({ error: "La guiaID es requerida" });
        }

        if (!fechaID) {
            return res.status(400).json({ error: "La fechaID es requerida" });
        }
        if (!total) {
            return res.status(400).json({ error: "total es requerido" });
        }

        if (!usuarioID) {
            return res.status(400).json({ error: "El usuarioID es requerido" });
        }

        adultos = adultos ? adultos : 0
        ninos = ninos ? ninos : 0
        tercera = tercera ? tercera : 0


        // Generate a unique ID for the new aventura
        const id = uuidv4();

        // Create the new aventura
        const reserva = {
            id,
            pagadoAlGuia,
            comision,
            fechaID,
            guiaID,
            tercera,
            ninos,
            adultos,
            usuarioID,
            total,
            tipoPago: "EFECTIVO"
        };

        console.log(reserva)

        // Save the new aventura in the database
        const response = await API.graphql({ query: createReserva, variables: { input: reserva } });
        console.log(response)

        const newReserva = response.data.createReserva;

        res.status(201).json(newReserva);
    } catch (error) {
        console.log(error)
        let message = error.message
        if (error?.errors) {
            message = error.errors.reduce((prev, curr) => {
                return prev += curr.message + "\n"
            }, "")
        }

        res.status(500).send({ error: `${message}` });
    }
});



module.exports = reservaRouter;