import api from "./api";

const getRTCConfig = async() => {
    try {
        const response = await api.get("/call/rtcconfig")
        return response.data
    } catch (err) {
        console.log("Error Fetching RTC config", err)
        throw err
    }
}

export default {getRTCConfig}