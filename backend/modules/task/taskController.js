const taskService = require('./task.service')

const getTask = async(req, res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user

        const tasks = await taskService.getTask({roomId, userId})

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
        const {newTask, targetUser} = req.body

        const task = await taskService.addTask({roomId, userId, targetUser, newTask})

        return res.status(200).json(task)
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const checkTask = async(req, res) => {
    try {
        const {roomId} = req.room
        const {userId} = req.user
        const {taskId} = req.body

        const checked = await taskService.checkTask({roomId, userId, taskId})

        return res.status(200).json(checked)
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const deleteTask = async(req, res) => {
    try {
        const {userId} = req.user
        const {roomRole} = req.room
        const {taskId} = req.params

        await taskService.deleteTask({userId, roomRole, taskId})

        return res.status(200).json({message: "Task Deleted Successfully"})
    }

    catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {getTask, addTask, checkTask, deleteTask}