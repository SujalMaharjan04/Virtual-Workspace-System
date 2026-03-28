const MESSAGE_EVENTS = require('../events')
const prisma = require('../../src/db')
const messageService = require('../../modules/message/messageService')

const registerMessageHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    socket.on(MESSAGE_EVENTS.SEND_ALL, async(data) => {
        try {
            const message = await messageService.sendMessage({
                messages: data.message,
                roomId,
                userId
            })

            io.to(roomId).emit(MESSAGE_EVENTS.SEND_ALL, {
                messageId: message.message_id,
                sent_by: userName,
                userId,
                sent_at: message.sent_at,
                message: message.message,
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
                roomId,
                userId,
                sentToId: data.sentToId,
                message: data.message
            })

            const sockets = await io.in(roomId).fetchSockets()
            const receiverSocket = sockets.find(s => s.userId === data.sentToId)

            const dmData = {
                messageId: message.message_id,
                userName,
                userId,
                message: message.message,
                sent_at: message.sent_at
            }

            if (receiverSocket) {
                io.to(receiverSocket.id).emit(MESSAGE_EVENTS.RECEIVE_DM, dmData)
            }

            socket.emit(MESSAGE_EVENTS.RECEIVE_DM, dmData)
        }
        catch (err) {
            console.log(err.message)
            socket.emit("error", {message: err.message})
        }
    })

}


module.exports = registerMessageHandler