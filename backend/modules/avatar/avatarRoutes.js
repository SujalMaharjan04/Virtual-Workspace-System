const avatarController = require('./avatarController')
const avatarRouter = require("express").Router()
const {userExtractor, roomExtractor} = require('../../utils/middleware')


//Route to update the avatar movement
avatarRouter.post("/move", userExtractor, roomExtractor, avatarController.upsertAvatar)

// Route to get the avatars data
avatarRouter.get("/display", roomExtractor, avatarController.getAvatar)

module.exports = avatarRouter