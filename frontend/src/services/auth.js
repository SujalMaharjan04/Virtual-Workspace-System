import api from './api'

const signUp = async(formData) => {
    try {
        
        const response = await api.post("/auth/signup", formData)

        return {success: true, data: response.data}


    }

    catch (error) {
        const message = error.response?.data?.message || error.message

        return {success: false, data: message}
    }
}

const login = async(formData) => {
    try {
        const response = await api.post("/auth/login", formData)
        return {success: true, data: response.data}
    }
    catch (error) {
        const message = error.response?.data?.message || error.message

        return {success:false, data: message}
    }
}

export default {signUp, login}