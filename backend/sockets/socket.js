const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const prisma = require("../src/db")
const socketMiddleware = require('./socket.middleware')
const registerRoomHandler = require('./handlers/room.handler')
const registerMessageHandler = require("./handlers/message.handler")
const registerAvatarHandler = require('./handlers/avatar.handler')
const registerTaskHandler = require('./handlers/task.handler')
const registerCallHandler = require('./handlers/call.handler')

let io

const initializeServer = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"]
        }
    })

    io.use(socketMiddleware)

    io.on("connection", async (socket) => {
        registerRoomHandler(io, socket)
        registerMessageHandler(io, socket)
        registerAvatarHandler(io, socket)
        registerTaskHandler(io, socket)
        registerCallHandler(io, socket)
    })

    

    return io;
}


const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized")

    return io
}

module.exports = {initializeServer, getIO}