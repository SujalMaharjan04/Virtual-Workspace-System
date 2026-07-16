import api from './api'

const addTask = async(task) => {
    try {
        const response = await api.post('/task/add-task', task)
        return response.data 
    } catch (err) {
        console.log("Error adding tasks", err)
    }
}

const updateTask = async(newTask) => {
    try {
        const response = await api.put("/task/update-task", newTask)
        return response.data
    } catch (err) {
        console.log("Error updating tasks", err)
    }
}

const deleteTask = async(id) => {
    try {
        const response = await api.delete(`/task/remove-task/${id}`) 
        return response.data
    } catch (err) {
        console.log("Error deleting tasks", err)
    }
}

export default {addTask, updateTask, deleteTask}