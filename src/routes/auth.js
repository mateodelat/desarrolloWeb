
const { Auth, API, graphqlOperation } = require('aws-amplify');
const AWS = require('aws-sdk');
const express = require('express');
const { getUsuario } = require('../graphql/queries');

const awsconfig = require('../aws-exports');



const authRouter = express.Router();

// Solicitud de inciar sesion
authRouter.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body


        if (!email || !password) {
            throw new Error("Error, el nombre o la contraseña no se recibieron")
        }

        const user = await Auth.signIn({
            password,
            username: email
        })




        res.json({ token: user.signInUserSession.accessToken.jwtToken })


    } catch (error) {
        console.log(error.message)

        res.status(404).json({
            error: error.message
        })
    }

});


// Solicitud de registro
authRouter.post('/signup', async (req, res) => {
    try {
        const { email, password, nickname } = req.body


        if (!email || !password || !nickname) {
            throw new Error("Error, el correo, la contraseña o el nickname no se recibieron")
        }
        const user = await Auth.signUp({
            username: email,
            password,
            attributes: {
                email,
                nickname: nickname
            }
        })


        res.json(user)


    } catch (error) {
        console.log(error.message)

        res.status(404).json({
            error: error.message
        })
    }

});

// Confirmacion de registro
authRouter.post('/confirm', async (req, res) => {
    try {
        const { email, code } = req.body


        if (!email || !code) {
            throw new Error("Error, el correo o el codigo no se recibieron")
        }

        const user = await Auth.confirmSignUp(
            email,
            code
        )


        // Pedir el usuario de la base de datos
        // const usuario = await (await API.graphql(graphqlOperation(getUsuario, { id: user.userSub }))).data.getUsuario

        res.json(user)


    } catch (error) {
        console.log(error.message)

        res.status(404).json({
            error: error.message
        })
    }

});

// Reenviar correo electronico
authRouter.post('/resendConfirm', async (req, res) => {
    try {
        const { email } = req.body


        if (!email) {
            throw new Error("Error, el correo no se recibio")
        }
        const r = await Auth.resendSignUp(email)


        res.json({ res: r })


    } catch (error) {
        console.log(error.message)

        res.status(404).json({
            error: error.message
        })
    }

});



// Validar si el token es valido
authRouter.get('/', async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            throw new Error("Error, no se recibio token en la solicitud")
        }

        await getSession(token)

        res.json({ valid: true })
    } catch (error) {
        console.log(error)

        res.status(404).json({ error: error.message })
    }

});



// Obtener un usuario a partir del token
authRouter.get('/user', async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            throw new Error("Error, no se recibio token en la solicitud")
        }

        const user = await getSession(token)

        const attributes = user.UserAttributes.reduce((acc, { Name, Value }) => {
            acc[Name] = Value;
            return acc;
        }, {});


        // Pedir el usuario de la base de datos
        const usuario = await (await API.graphql(graphqlOperation(getUsuario, { id: attributes.sub }))).data.getUsuario



        res.json(usuario)
    } catch (error) {
        console.log(error)

        res.status(404).send({ error: `${error.message}` })
    }

});

// Cerrar sesion (revokar un token)
authRouter.get('/signOut', async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            throw new Error("Error, no se recibio token en la solicitud")
        }

        // Reconfigurar aws cli
        AWS.config.update({
            region: awsconfig.aws_cognito_region,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: awsconfig.aws_cognito_identity_pool_id
            })
        });

        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();


        // Funcion para revocar el acceso a un token
        function revokeAccessToken(token) {
            const params = {
                Token: token
            };

            return new Promise((resolve, reject) => {
                cognitoidentityserviceprovider.revokeToken(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }

        revokeAccessToken(token)


        res.json({ success: true })
    } catch (error) {
        console.log(error)

        res.status(404).send({ error: `${error.message}` })
    }

});


async function getSession(token) {
    // Reconfigurar aws cli
    AWS.config.update({
        region: awsconfig.aws_cognito_region,
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: awsconfig.aws_cognito_identity_pool_id
        })
    });

    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();


    // Funcion para obtener una sesion de el usuario a partir de su acces token
    function getUserSession(token) {
        return new Promise((resolve, reject) => {
            cognitoidentityserviceprovider.getUser({ AccessToken: token }, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    const user = await getUserSession(token)

    return user


}

module.exports = authRouter;