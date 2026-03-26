const { roomExtractor } = require('../../utils/middleware')
const messageController = require('./messageController')
const messageRouter = require("express").Router()


//Route for getting all the messages in the room
messageRouter.get("/message", roomExtractor, messageController.getMessage)

module.exports = messageRouter