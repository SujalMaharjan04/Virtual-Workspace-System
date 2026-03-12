const express = require('express')
const path = require('path')
const {initializeServer} = require('../sockets/socket')
const http = require('http')
const authRouter = require('../modules/auth/authRoutes')
const roomRouter = require('../modules/rooms/roomRoutes')

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(express.static(path.resolve('./public')))

initializeServer(server)
app.use('/api/auth', authRouter)
app.use("/api/room", roomRouter)

module.exports = {app, server}