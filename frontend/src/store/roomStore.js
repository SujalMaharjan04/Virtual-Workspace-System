import { create } from "zustand";
import { persist } from "zustand/middleware";


const useRoomStore = create(
    persist(
        (set) => ({
            rooms: [],
            room: null,
            token: null,
            
            setRooms: (rooms) => set({rooms}),
            addRooms: (room) => set((state)=> ({rooms: [...state.rooms, room]})),
            setRoom: (room) => set({room}),
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


