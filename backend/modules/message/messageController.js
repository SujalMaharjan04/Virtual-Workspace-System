const messageService = require("./messageService")

const getMessage = async(req, res) => {
    try {
        const {roomId} = req.room

        const messages = await messageService.getMessage({roomId})

        return res.status(200).json(messages)
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
    
}

const getDM = async (req, res) => {
    try {
        const {roomId} =  req.room
        const {targetUserId} = req.params
        const {userId} = req.user   //user id that is receiving the dm messages

        const message = await messageService.getDM({roomId, userId, targetUserId})

        return res.status(200).json(message)
    }

    catch (err) {
        return res.status(500).json(err.message)
    }
}

const sendMessage = async(req, res) => {
    try {
        const {roomId} = req.room //Getting the room by extracting the room token
        const {userId} = req.user //Getting the user by extracting the login token

        if (!roomId) return res.status(403).json({error: "Room must be joined to message"})

        if (!userId) return res.status(403).json({error: "User should be logged in"})

        const {messages} = req.body

        if (!messages) return res.status(404).json({error: "Message not found"})

        const response = await messageService({messages, roomId, userId})

        return res.status(200).json(response)
    }

    catch (err) {
        return res.status(500).json(err.message)
    }
}

const sendDM = async(req, res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user //User Id that is sending the msg
        const {sentToId} = req.params //User Id that is receiving the msg via params
        const {message} = req.body

        if (!roomId || !userId || message) return res.status(403).json({error: "Invalid message"})

        const response = await messageService.sendDM({roomId, userId, sentToId, message})

        return res.status(200).json(response)
    }

    catch (err) {
        return res.status(400).json(err.message)
    }
}

module.exports = {getMessage, sendMessage, sendDM, getDM}