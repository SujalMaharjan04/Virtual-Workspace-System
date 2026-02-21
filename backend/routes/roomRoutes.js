const roomController = require("../controllers/roomController")
const { userExtractor } = require("../utils/middleware")
const roomRouter = require("express").Router()

//Route for creating a room
roomRouter.post("/createroom", userExtractor, roomController.createRoom)

//Router for joining a room
roomRouter.post("/join", userExtractor, roomController.joinRoom)

module.exports = roomRouter