const express = require('express')
const prisma = require("./db")
const authRouter = require('../routes/authRoutes')

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)

module.exports = app