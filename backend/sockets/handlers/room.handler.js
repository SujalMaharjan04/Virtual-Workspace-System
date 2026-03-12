const ROOM_EVENTS = require("../events")
const prisma = require("../../src/db")

const registerRoomHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId

    console.log(`User ${socket.userName} has connected to room ${socket.roomId}`)
        socket.join(socket.roomId)

        socket.to(socket.roomId).emit(ROOM_EVENTS.JOIN, {
            userId: socket.userId,
            message: `${socket.userName} has joined the room`
        })

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

        socket.emit(ROOM_EVENTS.USER_JOINED, {roomId: socket.roomId, message: "Succesfully joined"})

        // socket.on("message", (data) => {
        //     socket.to(socket.roomId).emit("message", {
        //         userId: socket.userId,
        //         userName: socket.userName,
        //         message: data.message,
        //         timestamp: new Date()
        //     })
        // })

        socket.on("disconnect", async() => {
            socket.to(socket.roomId).emit(ROOM_EVENTS.USER_LEFT, {
                userId: socket.userId,
                message: `${socket.userName} has left the room`
            })

            try {
                await prisma.room_members.update({
                    where: {
                        room_id_user_id: {
                            room_id: socket.roomId,
                            user_id: socket.userId
                        }
                    },
                    data: {
                        is_active: false
                    }
                })
            }
            catch (err) {
                console.log("update failed ", err.message)
            }
        })
}

module.exports = registerRoomHandler
