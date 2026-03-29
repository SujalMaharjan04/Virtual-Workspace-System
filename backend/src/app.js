const express = require('express')
const path = require('path')
const {initializeServer} = require('../sockets/socket')
const http = require('http')
const authRouter = require('../modules/auth/authRoutes')
const roomRouter = require('../modules/rooms/roomRoutes')
const messageRouter = require('../modules/message/messageRoutes')
const userRouter = require('../modules/user/userRoutes')

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use(express.static(path.resolve('./public')))

initializeServer(server)
app.use('/api/auth', authRouter)
app.use("/api/room", roomRouter)
app.use("/api/message", messageRouter)
app.use("/api/user", userRouter)

module.exports = {app, server}