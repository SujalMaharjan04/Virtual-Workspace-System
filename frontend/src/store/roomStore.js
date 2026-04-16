import { create } from "zustand";
import { persist } from "zustand/middleware";


const useRoomStore = create(
    persist(
        (set) => ({
            rooms: [],
            token: null,

            setRoomInfo: (room) => set((state) => ({rooms: [...state.rooms, room]})),
            setRoomToken: (token) =>  set({token, isActive:true})
        }),
        {
            name: "room-info",
            partialize: (state) => ({
                token: state.token,
            })
        }
    )
)

export default useRoomStore


