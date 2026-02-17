const express = require('express')

const authRouter = require('../routes/authRoutes')
const roomRouter = require('../routes/roomRoutes')

const app = express()
app.use(express.json())


app.use('/api/auth', authRouter)
app.use("/api/room", roomRouter)

module.exports = app