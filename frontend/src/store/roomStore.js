import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


const useRoomStore = create(
    persist(
        (set, get) => ({
            rooms: [],
            room: null,
            token: null,
            roomMembers: [],
                        // [
                        //     {
                        //         id,
                        //         name,
                        //         role,
                                    // is_active,
                        //     }
                        // ]
            emitLeave: null,
            aesKey: null,

            setAESKey: (aesKey) => set({aesKey}),

            registerEmitLeave: (fn) => set({emitLeave: fn}),
            
            setRooms: (rooms) => set({rooms}),
            addRooms: (room) => set((state)=> ({rooms: [...state.rooms, room]})),
            setRoom: (room) => set({room}),
            setRoomToken: (token) =>  set({token}),
            setRoomMembers: (members) => set({roomMembers: members}),
            addRoomMembers: ({id, name, role, is_active}) => set((state)  => {
                if (state.roomMembers.some(member => member.id === id)) {
                    return state
                }
                return {
                    roomMembers: [...state.roomMembers, {id, name, role, is_active}]
                }
            }),
            removeRoomMembers: ({userId}) => set((state) => ({
                roomMembers: state.roomMembers.filter(member => member.id !== userId)
            })),
            leave: ({userId, roomId}) => {
                set({room:null, token: null})
                const {emitLeave} = get()

                if (emitLeave) {
                    emitLeave({userId, roomId})
                }
                // localStorage.removeItem("room-info") 
                // sessionStorage.removeItem("room-info")
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


