import api from './api'

const signUp = async(formData) => {
    try {
        const response = await api.post("/auth/signup", formData)
        return response
    }

    catch (error) {
        return error.message
    }
}

export default {signUp}