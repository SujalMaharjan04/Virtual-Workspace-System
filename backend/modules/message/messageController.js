const messageService = require("./messageService")

const getMessage = async(req, res) => {
    try {
        // const {userId, userName} = req.user
        const {roomId} = req.room

        const messages = await messageService.getMessage({roomId})

        return res.status(200).json(messages)
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
    
}


const sendMessage = async(req, res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user

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

const sendMessageDM = async(req, res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user
        const {sentToId} = req.params
        const {message} = req.body

        if (!roomId || !userId || message) return res.status(403).json({error: "Invalid message"})

        const response = await messageService.sendMessageDM({roomId, userId, sentToId, message})

        return res.status(200).json(response)
    }

    catch (err) {
        return res.status(400).json(err.message)
    }
}

module.exports = {getMessage, sendMessage, sendMessageDM}