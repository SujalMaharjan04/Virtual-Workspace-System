import api from './api'

const getAllRooms = async() => {
    try {
        const response = await api.get("/room/getrooms")
        return response.data
    }

    catch (error) {
        const message = error.response?.data?.message || error.message
        return message
    }
}

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


export default {getAllRooms, createRoom, joinRoom}