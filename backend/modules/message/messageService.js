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

module.exports = {getMessage}