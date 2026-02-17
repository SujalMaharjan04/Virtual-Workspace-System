require('dotenv').config()
const bcrypt = require('bcrypt')
const prisma = require("../src/db")
const jwt = require('jsonwebtoken')

const generateRoomId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const createRoom = async({name, password}) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        let room_id
        let isUnique = false

        while (!isUnique) {
            room_id = generateRoomId()
            
            const existing = await prisma.room.findUnique({
                where: {room_id}
            })

            if (!existing) {
                isUnique = true
            }
        }

        const room = await prisma.room.create({
            data: {room_id, room_name: name, room_password: hashedPassword}
        })
        
        return room
    }

    catch (error) {
        throw error
    }
}

const joinRoom = async({id, password}) => {
    try {
        const room = await prisma.room.findUnique({
            where: {room_id: id}
        })

        if (!room) throw new Error("No Room with that id found")

        const passwordCheck = await bcrypt.compare(password, room.room_password)

        if (!passwordCheck) throw new Error('Password incorrect')

        const payload = {id, name: room.room_name}

        const token = jwt.sign(payload, process.env.SECRET, {expiresIn: "1D"})

        return token
    }
    catch (error) {
        throw error
    }
}

module.exports = {createRoom, joinRoom}