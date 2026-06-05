const {AVATAR_EVENTS} = require("../events")
const avatarService = require('../../modules/avatar/avatar.service')
const getSpawnPoint = require("../../utils/getSpawnPoint")

const registerAvatarHandler = (io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName



    // //On Avatar Creation
    // console.log("Emitting", AVATAR_EVENTS.CREATED)
    // socket.on(AVATAR_EVENTS.CREATED, async(data) => {
    //     try {
    //         const avatar = await avatarService.upsertAvatar({userId: data.userId, roomId:data.roomId, x: data.x, y: data.y, avatarId: data.avatarId})
    //     }
    //     catch (err){
    //         socket.emit("error", {message: err.message})
    //     }
    // })

    //When the User joins and creates the avatar
    socket.on(AVATAR_EVENTS.JOIN, async(data) => {
        let avatar = await avatarService.getSelfAvatar({userId: data.userId, roomId: data.roomId})
        if (!avatar) {
            const spawn = await getSpawnPoint()
            console.log(spawn)
            avatar = await avatarService.upsertAvatar({userId: data.userId, roomId: data.roomId, x: spawn.x, y: spawn.y, avatarId: data.avatarId})
            console.log(avatar)
        }

        socket.emit(AVATAR_EVENTS.SELF, avatar)
    })

    //On Avatar movement, update the db
    socket.on(AVATAR_EVENTS.MOVE, async(data) => {
        try {
            const avatar = await avatarService.upsertAvatar({userId: data.userId, roomId:data.roomId, x: data.x, y: data.y, avatarId: data.avatarId, direction:data.direction})
            if (!avatar) {
                console.log("error")
                return
            }
            console.log("EMITTING DISPLAY")
            socket.to(roomId).emit(AVATAR_EVENTS.DISPLAY, {
                userId: avatar.created_by, 
                userName: avatar.user?.name ?? socket.userName,
                x: avatar.x_axis,
                y: avatar.y_axis,
                direction: avatar.direction,
                avatarId: avatar.avatar_id
            })
        }

        catch (err) {
            console.log("ERROR MOVING", err.message)
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