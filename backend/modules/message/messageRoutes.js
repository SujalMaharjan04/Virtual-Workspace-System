const { roomExtractor } = require('../../utils/middleware')
const messageController = require('./messageController')
const messageRouter = require("express").Router()


//Route for getting all the messages in the room
messageRouter.get("/get-message", roomExtractor, messageController.getMessage)

//Route to get DM 
messageRouter.get("/get-dm", roomExtractor, messageController.getDM)

//Route for sending messages to everyone
messageRouter.post("/send-message", roomExtractor, messageController.sendMessage)

//Route for sending DM
messageRouter.post("/send-dm:sentToId", roomExtractor, messageController.sendDM)

module.exports = messageRouter