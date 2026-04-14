import { create } from "zustand";
import { persist } from "zustand/middleware";


const useRoomStore = create(
    persist(
        (set) => ({
            room: null,
            token: null,

            setRoomInfo: (room) => set({room}),
            setRoomToken: (token) =>  set({token, isActive:true})
        }),
        {
            name: "room-info",
            partialize: (state) => ({
                token: state.token,
                room: state.room
            })
        }
    )
)

export default useRoomStore


