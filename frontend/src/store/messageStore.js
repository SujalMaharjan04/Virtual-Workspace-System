import { create } from "zustand";
import useAuthStore from "./authStore";
import VectorClock from "../utils/algorithms/VectorClock";
import insertInCasualOrder from "../utils/insertInCasualOrder";

const useMessageStore = create(
    (set, get) => ({
        messages: {},
            // roomId: [{
            //     content: null,
            //     sender: null,
            //     receiver: null,
            //     time: null
            // }]

        //Vector Clock for the user
        vectorClock: {},
            // userId: {userId: count, otherUser: count}

        emitSend: null,

        registerEmitSend: (fn) => set({emitSend: fn}),

        //Update the clock of the user before sending the message
        tickClock: () => {
            const userId = useAuthStore.getState().user?.id
            if (!userId) return


            const current = get().vectorClock
            const updated = {
                ...current,
                [userId]: (current[userId] || 0) + 1
            }
            
            set({vectoreClock: updated})
            return updated
        },

        //Update the clock when receiving the message
        mergeClock: (incomingClock) => {
            const userId = useAuthStore.getState().user?.id
            const current = get().vectorclock

            //Taking the max value of each entry
            const merged = {...current}
            Object.entries(incomingClock).forEach(([id, count]) => {
                merged[id] = Math.max(merged[id] || 0, count)
            })

            //Increment our own counter after receiving the message
            merged[userId] = (merged[userId] || 0) + 1
            set({vectorClock: merged})
        },

        //Set the messages when the user joins the room filling the messages with already sent messages
        setMessage: (roomId, messages) => {
            set((state) => ({
                messages: {
                    ...state.message,
                    [roomId]: messages
                }
            }))
        },

        //Send the message 
        sendMessage: (roomId, message, vectorClock) => {
            const {emitSend} = get()
            if (emitSend) {
                emitSend(roomId, message, vectorClock)
            }
        },

        //This function firstly merges the vector clock of the sender with the user and then uses the inserInCasualOrder function to insert the msg at the correct index
        addMessage: (roomId, message) => {
            set((state) => {
                const existing = get().messages[roomId] || []
                get().mergeClock(message.vectorClock || {})

                const inserted = insertInCasualOrder(existing, message)

                return {
                    messages: {
                        ...state.messages,
                        [roomId]: inserted
                    }
                }
            })
        },

        //Remove the messages after the user leaves the room
        clearMessage: (roomId) => {
            set((state) => {
                const updated = {...state.messages}
                delete updated[roomId]
                return {
                    messages: updated,
                    vectorClock: {}
                }
            })
        }
    })
)

export default useMessageStore