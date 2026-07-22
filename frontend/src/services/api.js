import axios from 'axios'
import useAuthStore from '../store/authStore'
import useRoomStore from '../store/roomStore'
import { handleAuthError, handleRoomError } from '../utils/tokenError'

const api = axios.create({
    baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}/api`
})


api.interceptors.request.use((config) => {
    // const stored = localStorage.getItem('logged')
    // const roomToken = localStorage.getItem('room-info')
    const {token} = useAuthStore.getState()
    const roomToken = useRoomStore.getState().token

    if (token) {
        try {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    if (roomToken) {
        try {
            if (roomToken)
                config.headers['room-authorization'] = `Bearer ${roomToken}`
        }
        catch (error) {
            console.log(error)
        }
    }
    
    return config
})

api.interceptors.response.use(
    (response) => response,
    
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            const type = error.response?.data?.type

            switch (type) {
                //Auth Error Handling
                case "AUTH_TOKEN_EXPIRED":
                case "AUTH_TOKEN_MISSING":
                case "AUTH_TOKEN_INVALID":
                    handleAuthError()
                    break

                //Room Error Handling
                case "ROOM_TOKEN_EXPIRED":
                case "ROOM_TOKEN_MISSING":
                case "ROOM_TOKEN_INVALID":
                    handleRoomError()
                    break

                default:
                    handleAuthError()
                
            }
        } 

        return Promise.reject(error)
    }
)


export default api