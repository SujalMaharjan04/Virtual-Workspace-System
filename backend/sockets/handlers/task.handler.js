const taskService = require("../../modules/task/task.service")
const {TASK_EVENTS} = require("../events")

const registerTaskHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    socket.on(TASK_EVENTS.TASK_CREATED, async(data) => {
        try {
            io.to(roomId).emit(TASK_EVENTS.TASK_CREATED, {
                task: data.task,
                assigned_to: data.targetUser || userId
            })
        }
        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    socket.on(TASK_EVENTS.TASK_UPDATED, async(data) => {
        try {
                io.to(roomId).emit(TASK_EVENTS.TASK_UPDATED, {
                taskId: data.taskId,
                updates: data.updates
            })
        }
        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })

    socket.on(TASK_EVENTS.TASK_DELETED, async(data) => {
        try {
            io.to(roomId).emit(TASK_EVENTS.TASK_DELETED, {
                taskId: data.taskId,
                message: "Deleted Successfully"
            })
        }
        catch (err) {
            socket.emit("error", {message: err.message})
        }
    })
}


module.exports = registerTaskHandler