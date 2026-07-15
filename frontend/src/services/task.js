import api from './api'

const addTask = async(task) => {
    try {
        const response = await api.post('/task/add-task', task)
        return response.data 
    } catch (err) {
        console.log("Error adding tasks", err)
    }
}

export default {addTask}