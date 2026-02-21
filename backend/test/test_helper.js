const prisma = require('../src/db')

const usersInDb = async() => {
    const user = await prisma.user.findMany({})
    return user.map(u => u)
}

const roomInDb = async() => {
    const room = await prisma.room.findMany({})
    return room.map(r => r)
}

module.exports = {usersInDb, roomInDb}