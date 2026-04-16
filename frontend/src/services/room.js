import api from './api'


const createRoom = async(formData) => {
    try {
        const response = await api.post("/room/createroom", formData)

        return {success: true, data:response.data}

    } 
    catch (error) {
        const message = error.response?.data?.message || error.message
        return {success: false, data: message}
    }
}

const joinRoom = async(formData) => {
    try {
        const response = await api.post("/room/join", formData)

        return {success:true, data: response.data}
    }
    catch (error) {
        const message = error.response?.data?.message || error.message
        return {success: false, data: message}
    }
}


export default {createRoom, joinRoom}