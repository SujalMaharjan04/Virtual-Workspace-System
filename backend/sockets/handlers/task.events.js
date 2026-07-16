const eventBus = require("../../utils/eventBus")
const {TASK_EVENTS} = require("../events")

module.exports = (io) => {
    eventBus.on("task:added", async({roomId, task}) => {
        io.to(roomId).emit(TASK_EVENTS.TASK_CREATED, task)

        if (task.assigned_to?.id) {
            const sockets = await io.in(roomId).fetchSockets()
            const receiverSocket = sockets.find(s => s.userId === task.assigned_to.id)
    
            if (receiverSocket) {
                io.to(receiverSocket.id).emit(TASK_EVENTS.TASK_ASSIGNED, {
                    taskId: task.id,
                    title: task.task,
                    roomId
                })
            }
        }
    })

    eventBus.on("task:updated", async({roomId, updated}) => {
        io.to(roomId).emit(TASK_EVENTS.TASK_UPDATED, updated)

        if (updated.assigned_to?.id) {
            const sockets = await io.in(roomId).fetchSockets()
            const receiverSocket = sockets.find(s => s.userId === updated.assigned_to.id)

            if (receiverSocket) {
                io.to(receiverSocket.id).emit(TASK_EVENTS.TASK_UPDATED_NOTIFY, {
                    taskId: updated.id,
                    title: updated.task,
                    roomId
                })
            }
        }
    })

    eventBus.on("task:removed", async({roomId, taskId}) => {
        io.to(roomId).emit(TASK_EVENTS.TASK_DELETED, taskId)
    })
}