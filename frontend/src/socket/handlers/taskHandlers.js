import useNotificationStore from "../../store/notificationStore";
import useTaskStore from "../../store/taskStore";
import { TASK_EVENTS } from "../events";
import { getSocket } from "../index";


const registerTaskHandler = () => {
    const socket = getSocket()

    const onCreated = (tasks) => {
        const addTask = useTaskStore.getState().addTask

        addTask(tasks)
        useNotificationStore.getState().setNotification("Task added Successfully", "success")
        setTimeout(() => {
            useNotificationStore.getState().clearNotification()
        }, 5000)    
    }

    const onAssigned = (task) => {
        useNotificationStore.getState().setNotification(`New Task Assigned: ${task.title}`, "success")
        setTimeout(() => {
            useNotificationStore.getState().clearNotification()
        }, 5000)
    }

    const onUpdated = (updated) => {
        const updateTask = useTaskStore.getState().updateTask
        updateTask(updated)
    }

    const onUpdatedNotify = (data) => {
        console.log(data)
        useNotificationStore.getState().setNotification(`Task Updated`, "success")
        setTimeout(() => useNotificationStore.getState().clearNotification(), 5000)
    }
    
    const onDelete = (taskId) => {
        useTaskStore.getState().removeTask(taskId)
        useNotificationStore.getState().setNotification(`Task Deleted: ${taskId}`)
        setTimeout(() => useNotificationStore.getState().clearNotification(), 5000)
    }

    socket.on(TASK_EVENTS.TASK_CREATED, onCreated)

    socket.on(TASK_EVENTS.TASK_ASSIGNED, onAssigned)

    socket.on(TASK_EVENTS.TASK_UPDATED, onUpdated)

    socket.on(TASK_EVENTS.TASK_UPDATED_NOTIFY, onUpdatedNotify)

    socket.on(TASK_EVENTS.TASK_DELETED, onDelete)

    return () => {
            
        socket.off(TASK_EVENTS.TASK_CREATED, onCreated)

        socket.off(TASK_EVENTS.TASK_ASSIGNED, onAssigned)

        socket.off(TASK_EVENTS.TASK_UPDATED, onUpdated)

        socket.off(TASK_EVENTS.TASK_UPDATED_NOTIFY, onUpdatedNotify)
        
        socket.off(TASK_EVENTS.TASK_DELETED, onDelete)
    }
}

export default registerTaskHandler