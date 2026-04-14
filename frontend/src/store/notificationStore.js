import { create } from "zustand";


const useNotificationStore = create((set) => ({
    message: null,
    type: null,

    setNotification: (message, type) => set({message, type}),
    clearNotification: () => set({message: null, success: true})
}))


export default useNotificationStore 