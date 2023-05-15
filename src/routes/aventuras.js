const express = require('express');

const { graphqlOperation, API } = require('aws-amplify');
const { getStorageImages } = require('../controllers/utils');
const { getAventura, listAventuras } = require('../graphql/queries');
const { createAventura } = require('../graphql/mutations');

const { v4: uuidv4 } = require('uuid');





const aventuraRouter = express.Router();

// Obtener todos los productos
aventuraRouter.get('/', async (req, res) => {

    // Configurar pagination
    let { maxItems, page } = req.query

    maxItems = maxItems ? maxItems : 10
    page = page ? page : 0

    try {

        let response = await API.graphql(graphqlOperation(listAventuras, {
            filter: {
                estadoAventura: {
                    eq: "AUTORIZADO"
                },
            },
            limit: maxItems,
            page: page,
        }))

        // Filtrar por las que ya estan borradas
        response = response.data.listAventuras.items.filter(ave => !ave._deleted)

        let products = await Promise.all(response.map(async ave => {
            // Obtener las imagenes que nos son url de S3
            return await getStorageImages(ave)
        }))




        res.json(products);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(error.message)
    }

});


// Obtener un producto especifico
aventuraRouter.get('/:id', async (req, res) => {
    try {
        const { id } = req.params

        // Pedir la aventura desde graphql
        const response = await API.graphql(graphqlOperation(getAventura, { id }));
        const aventura = response.data.getAventura;

        res.status(200).json(aventura);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(`${error.message}`)
    }

});

// Crear una aventura
aventuraRouter.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: "El no se recibio cuerpo de la solicitud" });
        }

        // Validate input data
        const { titulo, imagenDetalle, duracion, descripcion, usuarioID, precioMin, precioMax, ubicacionId, distanciaRecorrida } = req.body;

        if (!titulo) {
            return res.status(400).json({ error: "El titulo es requerido" });
        }

        if (!imagenDetalle || !Array.isArray(imagenDetalle) || imagenDetalle.length === 0) {
            return res.status(400).json({ error: "La imagenDetalle es requerida" });
        }

        if (!duracion) {
            return res.status(400).json({ error: "La duracion es requerida" });
        }
        if (!distanciaRecorrida) {
            return res.status(400).json({ error: "La distanciaRecorrida es requerida" });
        }

        if (!usuarioID) {
            return res.status(400).json({ error: "El usuarioID es requerido" });
        }

        if (!precioMin) {
            return res.status(400).json({ error: "El precioMin es requerido" });
        }

        if (!precioMax) {
            return res.status(400).json({ error: "El precioMax es requerido" });
        }

        // Generate a unique ID for the new aventura
        const id = uuidv4();

        // Create the new aventura
        const aventura = {
            id,
            titulo,
            imagenDetalle,
            duracion,
            descripcion,
            imagenFondoIdx: 0,
            precioMin,
            precioMax,
            distanciaRecorrida,
            estadoAventura: "AUTORIZADO",
            categoria: "ALPINISMO",
            usuarioID,
            ubicacionId,
            dificultad: 3,
            altitud: 1543,
            materialDefault: JSON.stringify([["Obligatorio", ["Botas o tenis", "Impermeable", "Chamarra", "Camisa deportiva", "Mochila"]], ["Alimentacion", ["Bote con agua", "Barras o snacks"]], ["Acampada", ["Casa de campaña", "Colchoneta para dormir", "Casa de campaña"]]]),
            ubicacionNombre: "Iteso",
            coordenadas: JSON.stringify({ "latitude": 19.1085652, "longitude": -99.75476909999999 })

        };

        console.log(aventura)

        // Save the new aventura in the database
        const response = await API.graphql({ query: createAventura, variables: { input: aventura } });
        console.log(response)

        const newAventura = response.data.createAventura;

        res.status(201).json(newAventura);
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


module.exports = aventuraRouter;