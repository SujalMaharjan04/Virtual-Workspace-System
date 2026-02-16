const bcrypt = require('bcrypt')
const prisma = require("../src/db")

const createRoom = async({name, password}) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const room = await prisma.room.create({
            data: {room_name: name, room_password: hashedPassword}
        })
        
        return room
    }

    catch (error) {
        throw error
    }
}

module.exports = {createRoom}