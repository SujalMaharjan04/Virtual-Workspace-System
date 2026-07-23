const {ROOM_EVENTS, AVATAR_EVENTS} = require("../events")
const prisma = require('../../src/db')
const avatarService = require('../../modules/avatar/avatar.service')

const registerDisconnectHandler = async(io, socket) => {
    const {userId, roomId, userName} = socket
    console.log(`${socket.userName} has disconnected ${socket.id}`)
    socket.to(roomId).emit(ROOM_EVENTS.USER_LEFT, {
        userId,
        message: `${socket.userName} has left the room`
    })

    try {
        await prisma.room_members.update({
            where: {
                room_id_user_id: {
                    room_id: roomId,
                    user_id: userId
                }
            },
            data: {
                is_active: false
            }
        })
        await avatarService.deleteAvatar({userId, roomId})

        const activeMember = await prisma.room_members.count({
            where: {room_id: roomId, is_active: true}
        })

        if (activeMember === 0) {
            await prisma.room.update({
                where: {room_id: roomId},
                data: {is_active: false}
            })

            await prisma.messages.deleteMany({
                where: {
                    room_id: roomId
                }
            })
        }

        
    }
    catch (err) {
        console.log("update failed ", err.message)
        if (err.code === "P2002") {
            return
        }
    }
}

module.exports = registerDisconnectHandler