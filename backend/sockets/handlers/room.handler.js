const {ROOM_EVENTS} = require("../events")
const prisma = require("../../src/db")

const registerRoomHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId

    const room = await prisma.room.findUnique({
        where: {room_id: roomId}
    })

    //When the admin joins the room 
    if (room.created_by === userId) {
        await prisma.room.update({
            where: {room_id: roomId},
            data: {is_active: true}
        })
        socket.join(roomId)
        io.to(roomId).emit(ROOM_EVENTS.ADMIN_JOINED, {message: "Room is now active"})
    } else {
        //When others join the room
        if (!room.is_active) { // If room not active
            socket.emit(ROOM_EVENTS.INACTIVE, {message: "Room is not active yet, waiting for admin"})
            socket.disconnect()
            return 
        }
        socket.join(roomId)
        socket.to(roomId).emit(ROOM_EVENTS.JOIN, {
            userId,
            message: `${socket.userName} has joined the room`
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
        }
        catch (err) {
            console.log("update failed", err.message)
        }

        socket.emit(ROOM_EVENTS.USER_JOINED, {roomId, message: "Succesfully joined"})

        // socket.on("message", (data) => {
        //     socket.to(socket.roomId).emit("message", {
        //         userId: socket.userId,
        //         userName: socket.userName,
        //         message: data.message,
        //         timestamp: new Date()
        //     })
        // })

        //When the user leaves the room
        socket.on("disconnect", async() => {
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

                const activeMember = await prisma.room_members.count({
                    where: {room_id: roomId, is_active: true}
                })

                if (activeMember === 0) {
                    await prisma.room.update({
                        where: {room_id: roomId},
                        data: {is_active: false}
                    })
                }
            }
            catch (err) {
                console.log("update failed ", err.message)
            }
        })
}

module.exports = registerRoomHandler
