const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const prisma = require("../src/db")
const socketMiddleware = require('./socket.middleware')
const registerRoomHandler = require('./handlers/room.handler')

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
    })

    

    return io;
}


const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized")

    return io
}

module.exports = {initializeServer, getIO}