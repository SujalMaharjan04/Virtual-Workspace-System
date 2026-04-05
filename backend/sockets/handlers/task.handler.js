const taskService = require("../../modules/task/task.service")
const {TASK_EVENTS} = require("../events")

const registerTaskHandler = async(io, socket) => {
    const userId = socket.userId
    const roomId = socket.roomId
    const userName = socket.userName

    socket.on(TASK_EVENTS.TASK_CREATED, async(data) => {
        io.to(roomId).emit(TASK_EVENTS.TASK_CREATED, {
            task: data.task,
            assigned_to: data.targetUser || userId
        })
    })

    socket.on(TASK_EVENTS.TASK_UPDATED, async(data) => {
        io.to(roomId).emit(TASK_EVENTS.TASK_UPDATED, {
            taskId: data.taskId,
            updates: data.updates
        })
    })

    socket.on(TASK_EVENTS.TASK_DELETED, async(data) => {
        io.to(roomId).emit(TASK_EVENTS.TASK_DELETED, {
            message: "Deleted Successfully"
        })
    })
}


module.exports = registerTaskHandler