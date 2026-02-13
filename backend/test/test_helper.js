const prisma = require('../src/db')

const usersInDb = async() => {
    const user = await prisma.user.findMany({})
    return user.map(u => u)
}

module.exports = {usersInDb}