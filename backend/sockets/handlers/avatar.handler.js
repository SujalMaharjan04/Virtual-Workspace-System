const {AVATAR_EVENTS} = require("../events")
const avatarService = require('../../modules/avatar/avatar.service')

const registerAvatarHandler = (io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName



    //On Avatar Creation
    console.log("Emitting", AVATAR_EVENTS.CREATED)
    socket.on(AVATAR_EVENTS.CREATED, async(data) => {
        try {
            const avatar = await avatarService.upsertAvatar({userId: data.userId, roomId:data.roomId, x: data.x, y: data.y, avatarId: data.avatarId})
        }
        catch (err){
            socket.emit("error", {message: err.message})
        }
    })

    //On Avatar movement, update the db
    socket.on(AVATAR_EVENTS.MOVE, async(data) => {
        try {
            const avatar = await avatarService.upsertAvatar({userId: data.userId, roomId:data.roomId, x: data.x, y: data.y, avatarId: data.avatarId, direction:data.direction})

            socket.to(roomId).emit(AVATAR_EVENTS.DISPLAY, {
                userId, 
                userName: userName,
                x: avatar.x_axis,
                y: avatar.y_axis,
                direction,
                avatarId: avatar.avatar_id
            })
        }

        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    setImmediate(async () => {
        try {
            const avatars = await avatarService.getAvatar({userId, roomId})
            //Emits the avatar positions to other sockets
            socket.emit(AVATAR_EVENTS.POSITION, avatars)
        }
        catch (err) {
            console.log(err)
        }
    })
}

module.exports = registerAvatarHandler