const userService = require('./userService')

const getPublicKey = async(req, res) => {
    try {
        const {userId} = req.params

        const user = await userService.getPublicKey({userId})

        return res.status(200).json({publicKey: user.public_key})
    }
    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {getPublicKey}