const jwt = require('jsonwebtoken')
const config = require("./config")


//Extract the user token and verify
const userExtractor = (req, res, next) => {
    const authorization = req.get("authorization")
    if (authorization && authorization.includes("Bearer ")) {
        req.token = authorization.substring(7)
    } else {
        req.token = null
        return res.status(403).json({
            message: "No Token",
            type: "AUTH_TOKEN_MISSING"
        })
        
    }

    try {
        const decodedToken = jwt.verify(req.token, config.SECRET)
        if (!decodedToken.userId) {
            return res.status(401).json({
                message: "Token Invalid",
                type: "AUTH_TOKEN_INVALID"
            })
        }
        req.user = decodedToken
        
        next()
    }

    catch (error) {
        return res.status(401).json({
            message: "Token expired",
            type: "AUTH_TOKEN_EXPIRED"
        })
    }
}

//Extract the room Token and verify
const roomExtractor = (req, res, next) => {
    const roomAuth = req.get("room-authorization")
    if (roomAuth && roomAuth.includes("Bearer ")) {
        req.roomToken = roomAuth.substring(7)
    } else {
        req.roomToken = null
        return res.status(403).json({
            message: "Room Token Not Found",
            type: "ROOM_TOKEN_MISSING"
        })
        
    }

    try {
        const decodedRoom = jwt.verify(req.roomToken, config.SECRET)
        if (!decodedRoom.roomId) {
            return res.status(401).json({
                message: "Invalid Token",
                type: "ROOM_TOKEN_INVALID"
            })
        }

        req.room = decodedRoom
        next()
    }

    catch (error) {
        return res.status(401).json({
            message: "Room Token Expired",
            type: "ROOM_TOKEN_EXPIRED"
        })
    }
}

//Check if the user is permitted to assigned and edit task
const taskPermission = async(req, res, next) => {
    const {roomRole} = req.room
    const {userId} = req.user

    const {targetUser} = req.body

    if (targetUser && targetUser !== userId && roomRole !== "admin") {
        return res.status(403).json({error: "Only Room admin can assign tasks to others"})
    }

    next()
}

module.exports = {userExtractor, roomExtractor, taskPermission}