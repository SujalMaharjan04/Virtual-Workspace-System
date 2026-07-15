const {MESSAGE_EVENTS} = require('../events')
const prisma = require('../../src/db')
const messageService = require('../../modules/message/message.service')

const registerMessageHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    socket.on(MESSAGE_EVENTS.SEND_ALL, async(data) => {
        try {
            const message = await messageService.sendMessage({
               message: data.message.content,
               iv: data.message.iv,
               roomId: data.roomId,
               userId: data.message.sender.id,
               vectorClock: data.vectorClock
            })

            io.to(data.roomId).emit(MESSAGE_EVENTS.RECEIVE_ALL, {
                content: data.message.content,
                iv: data.message.iv,
                sender: {
                    name: data.message.sender.name,
                    id: data.message.sender.id
                },
                receiver: {
                    name: data.message.receiver.name,
                    id: data.message.receiver.id
                },
                vectorClock:data.vectorClock,
            })

        }
        catch (err) {
            console.log(err.message)
            socket.emit("error", {message: err.message})
        }
    })

    socket.on(MESSAGE_EVENTS.SEND_DM, async(data) => {
        try {
            const message = await messageService.sendDM({
                roomId: data.roomId,
                sentToId: data.message.receiver.id,
                sentBy: data.message.sender.id,
                message: data.message.content,
                iv: data.message.iv,
                vectorClock: data.vectorClock
            })
            
            const dmData = {
                content: data.message.content,
                iv: data.message.iv,
                sender: {
                    name: data.message.sender.name,
                    id: data.message.sender.id
                },
                receiver: {
                    name: data.message.receiver.name,
                    id: data.message.receiver.id
                },
                vectorClock: data.vectorClock

            }
            const sockets = await io.in(roomId).fetchSockets()
            const receiverSocket = sockets.find(s => s.userId === data.message.receiver.id)


            if (!receiverSocket) {
                socket.emit("error", {message: "User is not in the room"})
                return
            }
            io.to(receiverSocket.id).emit(MESSAGE_EVENTS.RECEIVE_DM, dmData)
            socket.emit(MESSAGE_EVENTS.RECEIVE_DM, dmData)
        }
        catch (err) {
            console.log(err.message)
            socket.emit("error", {message: err.message})
        }
    })

    socket.on(MESSAGE_EVENTS.LOAD_HISTORY, async (data) => {
        try {
            const messages = await messageService.getAllMessages({
                roomId: data.roomId,
                userId: userId
            })

            socket.emit(
                MESSAGE_EVENTS.RECEIVE_HISTORY,
                messages
            )
        } catch (err) {
            console.log(err)
        }
    })

}


module.exports = registerMessageHandler