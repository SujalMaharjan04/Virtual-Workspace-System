import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


const useRoomStore = create(
    persist(
        (set) => ({
            rooms: [],
            room: null,
            token: null,
            roomMembers: [],
            
            setRooms: (rooms) => set({rooms}),
            addRooms: (room) => set((state)=> ({rooms: [...state.rooms, room]})),
            setRoom: (room) => set({room}),
            setRoomToken: (token) =>  set({token}),
            setRoomMembers: (members) => set({roomMembers: members}),
            addRoomMembers: (members) => set((state) => ({roomMembers: [...state.roomMembers, members]})),
            leave: () => {
                set({room:null, token: null})
                // localStorage.removeItem("room-info") 
                sessionStorage.removeItem("room-info")
            }
        }),
        // {
        //     name: "room-info",
        //     partialize: (state) => ({
        //         token: state.token,
        //         room: state.room
        //     })
        // }
        {
            name: "room-info",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                token: state.token,
                room: state.room
            })

        }
    )
)

export default useRoomStore


