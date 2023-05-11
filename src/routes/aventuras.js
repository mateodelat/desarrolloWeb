const express = require('express');

const { graphqlOperation, API } = require('aws-amplify');
const { getStorageImages } = require('../controllers/utils');
const { getAventura, listAventuras } = require('../graphql/queries');




const aventuraRouter = express.Router();

// Obtener todos los productos
aventuraRouter.get('/', async (req, res) => {

    // Configurar pagination
    let { maxItems, page } = req.query

    maxItems = maxItems ? maxItems : 10
    page = page ? page : 0

    try {

        const response = await API.graphql(graphqlOperation(listAventuras, {
            filter: {
                estadoAventura: {
                    eq: "AUTORIZADO"
                }
            },
            limit: maxItems,
            page: page,
        }));

        let products = await Promise.all(response.data.listAventuras.items.map(async ave => {
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

module.exports = aventuraRouter;