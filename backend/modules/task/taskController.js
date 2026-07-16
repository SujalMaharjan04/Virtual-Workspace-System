const eventBus = require('../../utils/eventBus')
const taskService = require('./task.service')

const getTask = async(req, res) => {
    try {
        const {roomId, roomRole} = req.room
        const {userId} = req.user

        const tasks = await taskService.getTask({roomId, userId, roomRole})

        return res.status(200).json(tasks)
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const addTask = async(req,res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user
        const newTask = req.body

        const task = await taskService.addTask({roomId, userId, newTask})

        eventBus.emit("task:added", {
            roomId, task
        })
        return res.status(200).json(task)
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const updateTask = async(req, res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user
        const {id: taskId, ...updates} = req.body

        const updated = await taskService.updateTask({roomId, userId, taskId, changes: updates})
        eventBus.emit("task:updated", {
            roomId, updated
        })

        return res.status(200).json(updated)
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const deleteTask = async(req, res) => {
    try {
        const {userId} = req.user
        const {roomId, roomRole} = req.room
        const {taskId} = req.params
        
        await taskService.deleteTask({userId, roomRole, taskId})
        eventBus.emit("task:removed", {
            roomId,
            taskId
        })
        return res.status(200).json({message: "Task Deleted Successfully"})
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {getTask, addTask, updateTask, deleteTask}