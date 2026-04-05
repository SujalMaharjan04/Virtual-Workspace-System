const AVATAR_EVENTS = require("../events")
const prisma = require("../../src/db")
const avatarService = require('../../modules/avatar/avatar.service')

const registerAvatarHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    const avatars = await avatarService.getAvatar({roomId})
    socket.emit(AVATAR_EVENTS.POSITION, avatars)

    socket.on(AVATAR_EVENTS.MOVE, async(data) => {
        try {
            const avatar = await avatarService.upsertAvatar({userId, roomId,  x:data.x, y:data.y})

            socket.to(roomId).emit(AVATAR_EVENTS.DISPLAY, {
                userId, 
                userName: userName,
                x: avatar.x_axis,
                y: avatar.y_axis
            })
        }

        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })
}

module.exports = registerAvatarHandler