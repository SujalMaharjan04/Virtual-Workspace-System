import useNotificationStore from "../../store/notificationStore";
import useTaskStore from "../../store/taskStore";
import { TASK_EVENTS } from "../events";
import { getSocket } from "../index";


const registerTaskHandler = () => {
    const socket = getSocket()
    
    socket.on(TASK_EVENTS.TASK_CREATED, (tasks) => {
        const addTask = useTaskStore.getState().addTask

        addTask(tasks)
        useNotificationStore.getState().setNotification("Task added Successfully", "success")
        setTimeout(() => {
            useNotificationStore.getState().clearNotification()
        }, 3000)

    })
}

export default registerTaskHandler