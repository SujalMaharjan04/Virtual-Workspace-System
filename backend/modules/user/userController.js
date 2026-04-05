const userService = require('./user.service')

const getPublicKey = async(req, res) => {
    try {
        const {userId} = req.params //userId of the targeted user whose public key is needed 

        const user = await userService.getPublicKey({userId})

        return res.status(200).json({publicKey: user.public_key})
    }
    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {getPublicKey}