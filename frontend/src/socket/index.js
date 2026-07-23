import {io} from "socket.io-client"

// const socket = io(import.meta.env.VITE_APP_BACKEND_URL, {
//     withCredentials: true,
//     autoConnect: false,
// })




// export default socket
let socket
export const createSocket = (token) => {
    console.log("Creating NEW socket");
    if (socket) return socket
    socket = io(import.meta.env.VITE_APP_BACKEND_URL, {
        auth: {token},
        withCredentials: true,
        autoConnect: true
    })

    return socket
}

export const getSocket = () => socket