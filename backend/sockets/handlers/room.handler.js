const {ROOM_EVENTS} = require("../events")
const prisma = require("../../src/db")
const avatarService = require('../../modules/avatar/avatar.service')
const userService = require('../../modules/user/user.service')
const roomService = require('../../modules/rooms/room.service')

const registerRoomHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    const room = await prisma.room.findUnique({
        where: {room_id: roomId}
    })



    //When the admin joins the room 
    if (room.created_by === userId) {
        await prisma.room.update({
            where: {room_id: roomId},
            data: {is_active: true, admin_socket_id: socket.id}
        })

        socket.join(roomId)
        io.to(roomId).emit(ROOM_EVENTS.ADMIN_JOINED, {message: "Room is now active"})
        

        socket.on(ROOM_EVENTS.SHARE_ENCRYPT_KEY, ({encryptedKey, requesterSocketId}) => {
            io.to(requesterSocketId).emit(ROOM_EVENTS.RECEIVE_AES_KEY, (encryptedKey))
        })
    } else {
        //When others join the room
        if (!room.is_active) { // If room not active
            socket.emit(ROOM_EVENTS.INACTIVE, {message: "Room is not active yet, waiting for admin"})
            socket.disconnect()
            return 
        }
        socket.join(roomId)
        //Event to send the public key
        socket.on(ROOM_EVENTS.SHARE_PUBLIC_KEY, async() => {
            const room = await prisma.room.findUnique({
                where: {room_id: roomId},
                select: {admin_socket_id: true}
            })
            
            const user = await userService.getPublicKey(userId)
            
            if (!room?.admin_socket_id) {
                socket.emit(ROOM_EVENTS.ERROR, {message: "Admin is not available"})
                return
            }

            if (!user?.public_key) {
                socket.emit(ROOM_EVENTS.ERROR, {message: "User Public Key is missing"})
                return 
            }
            
            io.to(room.admin_socket_id).emit(ROOM_EVENTS.ADMIN_ENCRYPT_KEY, {
                userPublicKey: user.public_key,
                requesterSocketId: socket.id
            })
        })
    }
        
        try {
            await prisma.room_members.upsert({
                where: {
                    room_id_user_id: {
                        user_id: socket.userId,
                        room_id: socket.roomId
                    }
                },
                update: {
                    is_active: true
                },
                create: {
                    room_id: socket.roomId,
                    user_id: socket.userId,
                    is_active: true
                }
            })
            
            const members = await roomService.getRoomMember(roomId)
            socket.emit(ROOM_EVENTS.MEMBERS, members)
            socket.to(roomId).emit(ROOM_EVENTS.JOIN, {
                userId,
                userName,
                message: `${socket.userName} has joined the room`
            })
        }
        catch (err) {
            console.log("update failed", err.message)
        }

        // socket.on("message", (data) => {
        //     socket.to(socket.roomId).emit("message", {
        //         userId: socket.userId,
        //         userName: socket.userName,
        //         message: data.message,
        //         timestamp: new Date()
        //     })
        // })



    //When the user leaves the room
    socket.on(ROOM_EVENTS.LEAVE, async({userId, roomId}) => {
        try {
            socket.to(roomId).emit(ROOM_EVENTS.USER_LEFT, {
                userId, userName
            })

            await avatarService.deleteAvatar({userId, roomId})
        }
        catch (err) {
            console.log(err)
        }
    })

}

module.exports = registerRoomHandler
