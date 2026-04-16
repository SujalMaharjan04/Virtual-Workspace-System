
const roomService = require("./room.service")



const createRoom = async(req, res) => {
    try {
        const {roomName, password} = req.body
        const {userId, userName} = req.user

        if (!roomName || !password) {
            return res.status(400).json({error: "Name and Password should be given"})
        }

        if (!userId) {
            return res.status(403).json({error: "No user logged in"})
        }

        const {token, room} = await roomService.createRoom({roomName, password, userId, userName})

        res.status(201).json({
            message: "Room created",
            token, room
        })
    }

    catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})

    }
}

const joinRoom = async(req, res) => {
    try {
        const {roomId, password} = req.body
        const {userId, userName} = req.user
        
        
        if (!roomId || !password) {
            return res.status(400).json({error: "Id and Password should be given"})
        }

        const {token, room} = await roomService.joinRoom({roomId, password, userId, userName})

        res.status(200).json({token, room})

    }

    catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

const leaveRoom = async(req, res) => {
    try {
        console.log(req.user)
        const {roomId} = req.body
        const {userId} = req.user
        if (!roomId) return res.status(400).json({error: "No room found to leave"})

        const room = await roomService.leaveRoom({roomId, userId})

        res.status(200).json({message: "Room Left"})
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({error: err.message})
    }
}


const getRoomMember = async(req, res) => {
    try {
        const {roomId} = req.room

        const members = await roomService.getRoomMember({roomId})

        return res.status(200).json({members})
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {createRoom, joinRoom, getRoomMember, leaveRoom}