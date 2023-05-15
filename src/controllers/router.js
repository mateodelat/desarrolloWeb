const express = require("express")
const path = require("path")
const aventuraRouter = require("../routes/aventuras")
const fechaRouter = require("../routes/fechas")
const authRouter = require("../routes/auth")


const router = express.Router()


router.use(express.json())

// Para la ruta defecto
router.get("/", (req, res) => res.sendFile(path.resolve(__dirname + "/../index.html")))

router.use("/aventura", aventuraRouter)
router.use("/fecha", fechaRouter)

router.use("/auth", authRouter)

module.exports = router