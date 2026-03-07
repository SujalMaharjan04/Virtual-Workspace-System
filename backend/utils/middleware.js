const jwt = require('jsonwebtoken')
const config = require("./config")


const userExtractor = (req, res, next) => {
    const authorization = req.get("authorization")

    if (authorization && authorization.includes("Bearer ")) {
        req.token = authorization.substring(7)
    } else {
        req.token = null
        next()
    }

    try {
        const decodedToken = jwt.verify(req.token, config.SECRET)
        console.log('decodedtoken:', decodedToken)
        if (!decodedToken.userId) {
            return res.status(401).json({error: "Invalid token"})
        }

        req.user = decodedToken
        next()
    }

    catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {userExtractor}