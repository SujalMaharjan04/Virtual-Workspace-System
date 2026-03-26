const messageService = require("./messageService")

const getMessage = async(req, res) => {
    try {
        // const {userId, userName} = req.user
        const {roomId} = req.room

        const messages = await messageService.getMessage({roomId})

        return res.status(200).json(messages)
    }
    catch (err) {
        return res.status(500).json(err.message)
    }
    
}


const storeMessage = async(req, res) => {

}

module.exports = {getMessage}