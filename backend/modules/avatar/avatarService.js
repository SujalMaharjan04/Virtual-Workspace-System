const prisma = require('../../src/db')

const upsertAvatar = async({userId, roomId, x, y}) => {
    try {
        return await prisma.avatar.upsert({
            where: {
                created_by_room_id: {
                    created_by: userId,
                    roomId: roomId
                }
            }, 
            update: {
                x_axis: x,
                y_axis: y
            },
            create: {
                created_by: userId,
                room_id: roomId,
                x_axis: x,
                y_axis: y
            }
        })
    }

    catch (err) {
        throw err
    }
}

const getAvatar = async({roomId}) => {
    return await prisma.avatar.findMany({
        where: {
            room_id: roomId
        },
        include: {select: {name: true, user_id: true}}
    })
}

module.exports = {upsertAvatar, getAvatar}