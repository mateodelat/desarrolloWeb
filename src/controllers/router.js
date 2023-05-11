const express = require("express")
const path = require("path")
const aventuraRouter = require("../routes/aventuras")
const fechaRouter = require("../routes/fechas")
const loginRouter = require("../routes/login")


const router = express.Router()



// Para la ruta defecto
router.get("/", (req, res) => res.sendFile(path.resolve(__dirname + "/../index.html")))

router.use("/aventura", aventuraRouter)
router.use("/fecha", fechaRouter)

router.use("/login", loginRouter)

module.exports = router