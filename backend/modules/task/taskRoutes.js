const taskController = require('./taskController')
const taskRouter = require('express').Router()
const {userExtractor, roomExtractor, taskPermission} = require('../../utils/middleware')

//Route for getting all the task
taskRouter.get("/all-task", userExtractor, roomExtractor, taskController.getTask)

//Route for adding a task
taskRouter.post("/add-task", userExtractor, roomExtractor, taskPermission, taskController.addTask)

//Route for signing the task complete
taskRouter.put("/completed", userExtractor, roomExtractor, taskController.checkTask)

module.exports = taskRouter