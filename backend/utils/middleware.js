const jwt = require('jsonwebtoken')
const config = require("./config")


const userExtractor = (req, res, next) => {
    const authorization = req.get("authorization")

    if (authorization && authorization.includes("Bearer ")) {
        req.token = authorization.substring(7)
    } else {
        req.token = null
        next()
    }

    try {
        const decodedToken = jwt.verify(req.token, config.SECRET)
        if (!decodedToken.userId) {
            return res.status(401).json({error: "Invalid token"})
        }
        req.user = decodedToken
        
        next()
    }

    catch (error) {
        return res.status(400).json(error.message)
    }
}

const roomExtractor = (req, res, next) => {
    const roomAuth = req.get("room-authorization")
    if (roomAuth && roomAuth.includes("Bearer")) {
        req.roomToken = roomAuth.substring(7)
    } else {
        req.roomToken = null
        next()
    }

    try {
        const decodedRoom = jwt.verify(req.roomToken, config.SECRET)
        if (!decodedRoom.roomId) {
            return res.status(401).json({error: "Invalid Token"})
        }

        req.room = decodedRoom
        next()
    }

    catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {userExtractor, roomExtractor}