const roomController = require("../controllers/roomController")
const roomRouter = require("express").Router()

//Route for creating a room
roomRouter.post("/createroom", roomController.createRoom)

//Router for joining a room
roomRouter.post("/join", roomController.joinRoom)

module.exports = roomRouter