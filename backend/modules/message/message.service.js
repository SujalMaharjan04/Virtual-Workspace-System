const prisma = require("../../src/db")

const getAllMessages = async({roomId, userId}) => {
    try {
        const messages = await prisma.messages.findMany({
            where: {
                room_id: roomId,
                OR: [
                    {sent_to: null},
                    {sent_by: userId},
                    {sent_to: userId}
                ]
            
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

        return messages
    }
    catch (err) {
        throw err
    }
}

const getDM = async({roomId, userId, targetUserId}) => {
    try {
        const message = await prisma.messages.findMany({
            where: {
                room_id: roomId,
                OR: [
                    {sent_to: userId, sent_by: targetUserId},
                    {sent_to: targetUserId, sent_by: userId}
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

const sendMessage = async({message, roomId, userId, iv,  vectorClock}) => {
    try {
        const response = await prisma.messages.create({
            data: {
                message,
                iv,
                room_id: roomId,
                sent_by: userId,
                vector_clock: vectorClock
            }
        })

        if (!response) throw new Error("Something went wrong during chat")
        
        return response
    }

    catch (err) {
        throw err
    }
}

const sendDM = async({roomId, sentToId, sentBy, message, iv, vectorClock}) => {
    try {
        const response = await prisma.messages.create({
            data: {
                message,
                iv,
                room_id: roomId,
                sent_by: sentBy,
                sent_to: sentToId,
                vector_clock: vectorClock
            }
        })

        if (!response) throw new Error("Something went wrong during dm")

        return response
    }

    catch (err) {
        throw err
    }
}

module.exports = {getAllMessages, sendMessage, sendDM, getDM}