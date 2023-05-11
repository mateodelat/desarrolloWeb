const { Auth } = require('aws-amplify');
const express = require('express');



const loginRouter = express.Router();

// Solicitud de inciar sesion
loginRouter.post('/', async (req, res) => {

    try {

        console.log(req.body)
        await Auth.currentCredentials()


        res.json(products);
    } catch (error) {
        console.log(error.message)

        res.status(404).send(error.message)
    }

});


// Obtener la sesion actual
loginRouter.get('/', async (req, res) => {
    try {
        console.log(req)
        res.send("Jala la prueba")
    } catch (error) {
        console.log(error.message)

        res.status(404).send(`${error.message}`)
    }

});

module.exports = loginRouter;