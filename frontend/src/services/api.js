import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3001/api",
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('logged')
    const roomToken = localStorage.getItem('room-token')

    if (token) {
        try {
            const user = JSON.parse(token)
            if (user.token) {
                config.headers.Authorization = `Bearer ${user.token}`
            }
        }

        catch (error) {
            return error
        }
    }

    if (roomToken) {
        try {
            const room = JSON.parse(roomToken)
            if (room.token)
                config.headers['room-authorization'] = `Bearer ${room.token}`
        }
        catch (error) {
            return error
        }
    }

    return config
})


export default api