const eventBus = require("../../utils/eventBus")
const {TASK_EVENTS} = require("../events")

module.exports = (io) => {
    eventBus.on("task:added", async({roomId, task}) => {
        const sockets = await io.in(roomId).fetchSockets()
        const receiverSocket = sockets.find(s => s.userId === task.assigned_to.id)

        if (receiverSocket) {
            io.to(receiverSocket.id).emit(TASK_EVENTS.TASK_CREATED, task)
        }
    })
}