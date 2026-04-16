import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3001/api",
})


api.interceptors.request.use((config) => {
    const stored = localStorage.getItem('logged')
    const roomToken = localStorage.getItem('room-token')

    if (stored) {
        const parsed = JSON.parse(stored)
        const state = parsed.state

        try {
            if (state.token) {
                config.headers.Authorization = `Bearer ${state.token}`
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    if (roomToken) {
        try {
            const room = JSON.parse(roomToken)
            if (room.token)
                config.headers['room-authorization'] = `Bearer ${room.token}`
        }
        catch (error) {
            console.log(error)
        }
    }

    return config
})


export default api