const jwt = require("jsonwebtoken")
const config = require("../utils/config")

const socketMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) return next(new Error("Authentication Error: No Token"))

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
    
}

module.exports = socketMiddleware