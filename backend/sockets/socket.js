const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const initializeServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3001",
            methods: ["GET", "POST"]
        }
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth.token

        if (!token) {
            return next(new Error("Authentication Error: No token"))
        }

        try {
            const decoded = jwt.verify(token, config.SECRET)
            socket.userId = decoded.userId
            socket.roomId = decoded.roomId
            next()
        }
        catch (error) {
            next(new Error("Invalid Token" + error.message))
        }
    })

    io.on("connection", (socket) => {
        console.log(`User ${socket.userId} has connected to room ${socket.roomId}`)
        socket.join(socket.roomId)

        socket.to(socket.roomId).emit("user-joined", {
            userId: socket.userId,
            message: "A new user has joined the room"
        })
    })


}

module.exports = {initializeServer}