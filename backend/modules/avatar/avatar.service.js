const prisma = require('../../src/db')

const upsertAvatar = async({userId, roomId, x, y, direction = "down", avatarId}) => {
    try {
        return await prisma.avatar.upsert({
            where: {
                created_by_room_id: {
                    created_by: userId,
                    room_id: roomId
                }
            }, 
            update: {
                x_axis: x,
                y_axis: y,
                direction: direction,
                avatar_id: avatarId
            },
            create: {
                created_by: userId,
                room_id: roomId,
                x_axis: x,
                y_axis: y,
                avatar_id: avatarId
            }
        })
    }

    catch (err) {
        throw err
    }
}

const getAvatar = async({userId, roomId}) => {
    return await prisma.avatar.findMany({
        where: {
            room_id: roomId,
            created_by: {
                not: userId
            }
        },
        include: {user: {select: {name: true, user_id: true}}}
    })
}

module.exports = {upsertAvatar, getAvatar}