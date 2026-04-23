const roomController = require("./roomController")
const { userExtractor, roomExtractor } = require("../../utils/middleware")
const roomRouter = require("express").Router()

//Route to get all the rooms user has visited or created
roomRouter.get("/getrooms", userExtractor, roomController.getAllRooms)
//Route for creating a room
roomRouter.post("/createroom", userExtractor, roomController.createRoom)

//Router for joining a room
roomRouter.post("/join", userExtractor, roomController.joinRoom)

//Route for getting the members of the room
roomRouter.get("/members", userExtractor, roomExtractor, roomController.getRoomMember)

//Route for leaving the room
roomRouter.post("/leave", userExtractor, roomExtractor, roomController.leaveRoom)

module.exports = roomRouter