const prisma = require('../src/db')

const usersInDb = async() => {
    const user = await prisma.user.findMany({})
    return user
}

const roomInDb = async() => {
    const room = await prisma.room.findMany({})
    return room
}

const membersInRoom = async() => {
    const roomMembers = await prisma.room_members.findMany({})
    return roomMembers
}


module.exports = {usersInDb, roomInDb, membersInRoom}