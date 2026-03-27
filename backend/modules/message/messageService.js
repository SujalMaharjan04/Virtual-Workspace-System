const prisma = require("../../src/db")

const getMessage = async({roomId}) => {
    try {
        const messages = await prisma.messages.findMany({
            where: {
                room_id: roomId,
                sent_to: null
            
            },
            orderBy: {sent_at: "asc"},
            include: {
                sender: {
                    select: {name: true, user_id: true}
                }
            }
        })

        return messages
    }
    catch (err) {
        throw err
    }
}

const getDM = async({roomId, userId}) => {
    try {
        const message = await prisma.messages.findMany({
            where: {
                room_id: roomId,
                OR: [
                    {sent_to: userId},
                    {sent_by: userId}
                ],
                NOT: {sent_to: null}
            
            },
            orderBy: {sent_at: "asc"},
            include: {
                sender: {
                    select: {name: true, user_id: true}
                },
                receiver: {
                    select: {name: true, user_id: true}
                }
            }
        })

        return message
    }
    catch (err) {
        throw err
    }
}

const sendMessage = async({messages, roomId, userId}) => {
    try {
        const response = await prisma.messages.create({
            data: {
                message: messages,
                room_id: roomId,
                sent_by: userId
            }
        })

        if (!response) throw new Error("Something went wrong during chat")
    }

    catch (err) {
        throw err
    }
}

const sendDM = async({roomId, userId, sentToId, message}) => {
    try {
        const response = await prisma.messages.create({
            data: {
                message,
                room_id: roomId,
                sent_by: userId,
                sent_to: sentToId
            }
        })

        if (!response) throw new Error("Something went wrong during dm")

        return response
    }

    catch (err) {
        throw err
    }
}

module.exports = {getMessage, sendMessage, sendDM, getDM}