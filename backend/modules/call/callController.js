const {getRTCConfig} = require("../../utils/rtcconfig")

const getRTCConfiguration = async(req, res) => {
    try {
        const config = getRTCConfig()
        return res.status(200).json(config)
    } 
    catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = {getRTCConfiguration}