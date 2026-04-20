const avatarService = require('./avatar.service')

const upsertAvatar = async(req, res) => {
    try {
        const {roomId} = req.roomId
        const {userId} = req.user

        const {x, y} = req.body


        const avatar = await avatarService.upsertAvatar({roomId, userId, x, y})

        return res.status(200).json(avatar)
    }
    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const getAvatar = async(req, res) => {
    try {
        const {roomId} = req.room

        const avatar = await avatarService.getAvatar({roomId})

        return res.status(200).json(avatar)
    }
    catch (err) {
        return res.status(500).json({error: err.message})
    }

}


module.exports = {upsertAvatar, getAvatar}