import express from 'express'
import { Amplify } from 'aws-amplify';
const DIST_DIR = __dirname


import awsconfig from './aws-exports'
import router from './controllers/router';


const app = express()

app.use(express.static(DIST_DIR))
app.use(express.static("src"))

app.use(router)

Amplify.configure(awsconfig);



export const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to http://localhost:${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
