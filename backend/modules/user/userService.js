const prisma = require('../../src/db')

const getPublicKey = async({userId}) => {
    try {
        const user = await prisma.user.findUnique({
            where: {user_id: userId},
            select: {public_key: true}
        })

        if (!user) {
            throw new Error("User not found")
        }

        if (!user.public_key) {
            throw new Error("Public key not found")
        }

        return user
    }
    catch (err) {
        throw err
    }
}

module.exports = {getPublicKey}