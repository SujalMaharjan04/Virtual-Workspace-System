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
            if (!decoded.roomId) {
                return next(new Error("Authentication Error: No Room ID"))
            }

            if (!decoded.userId) {
                return next(new Error("Authentication Error: No User Id"))
            }


            socket.userId = decoded.userId
            socket.roomId = decoded.roomId
            socket.userName = decoded.userName
            
            next()
        }
        catch (error) {
            next(new Error("Invalid Token" + error.message))
        }

    })

    io.on("connection", (socket) => {
        console.log(`User ${socket.userName} has connected to room ${socket.roomId}`)
        socket.join(socket.roomId)

        socket.to(socket.roomId).emit("user-joined", {
            userId: socket.userId,
            message: `${socket.userName} has joined the room`
        })

        socket.emit("joined-room", {roomId: socket.roomId, message: "Succesfully joined"})
    })

    io.on("disconnect", () => {
        socket.to(socket.roomId).emit("user-left", {
            userId: socket.userId,
            message: `${socket.userName} has left the room`
        })
    })

    return io;
}


const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized")

    return io
}

module.exports = {initializeServer}