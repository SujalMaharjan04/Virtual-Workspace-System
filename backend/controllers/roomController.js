
const roomService = require("../services/room.service")



const createRoom = async(req, res) => {
    try {
        const {name, password} = req.body

        if (!name || !password) {
            return res.status(400).json({error: "Name and Password should be given"})
        }

        const room = await roomService.createRoom({name, password})

        res.status(201).json({
            message: "Room created",
            room: {
                id: room.room_id,
                name: room.room_name,
            }
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
        const {userId} = req.user
        
        if (!roomId || !password) {
            return res.status(400).json({error: "Id and Password should be given"})
        }

        const room = await roomService.joinRoom({roomId, password, userId})

        res.status(200).json({token: room})

    }

    catch (error) {
        console.log(error.message)
        res.status(500).json({error: error.message})
    }
}

module.exports = {createRoom, joinRoom}