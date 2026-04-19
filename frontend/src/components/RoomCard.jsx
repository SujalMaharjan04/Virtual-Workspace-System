import { useState } from "react"
import Togglable from "./Togglable"
import roomService from "../services/room"
import useRoomStore from "../store/roomStore"
import RoomForm from "./RoomForm"

const RoomCard = ({id, name, maxCapacity}) => {
    const [activeModal, setActiveModal] = useState(null)
    const [error, setError] = useState({})
    const rooms = useRoomStore(state => state.rooms)
    const room = useRoomStore(state => state.room)
    const setRoom = useRoomStore(state => state.setRoom)
    const setRoomToken = useRoomStore(state => state.setRoomToken)
    const addRooms = useRoomStore(state => state.addRooms)
    const [join, setJoin] = useState({
        "roomId": id,
        "password": ""
    })

    const handleJoin = (e) => {
        const {name, value} = e.target

        setJoin((prev => ({
            ...prev,
            [name]: value
        })))
    }

    const handleJoinSubmit = async(e) => {
        e.preventDefault()

        const newErrors = {}

        if (!join.roomId) newErrors.roomId = "Room Id missing"

        if (!join.password) newErrors.password = "Password missing"

        setError(newErrors)

        if (Object.keys(newErrors).length === 0) {
            const response = await roomService.joinRoom(join)
            setRoom(response.data.room)
            setRoomToken(response.data.token)

            const roomExist = rooms.some(r => r.id === response.data.room.id)
            if (!roomExist) {
                addRooms(room)
            }
        }

        
    }

    return (
        <div className = "bg-[#1A1D2E] flex flex-col justify-start items-start p-4 h-48 w-full gap-6 rounded-2xl">
            <div>
                <h1 className = "font-bold text-2xl">{name}</h1>
            </div>

            <div className = "px-2">
                <h2 className = "font-semibold text-xl">Members: {maxCapacity}</h2>
            </div>

            <Togglable buttonClass = "roomButton" buttonLabel = "Join" isOpen = {activeModal === 'join'} onOpen = {() => setActiveModal("join")} onClose = {() => setActiveModal(null)}>
                <RoomForm topic = "Join A Room" name1 = "roomId" label1 = "Room Id" input1 = {join.roomId} error1 = {error.roomId} error2 = {error.password} input2 = {join.password} handleInput = {handleJoin} handleSubmit={handleJoinSubmit} disabledInput1 = {true} />
            </Togglable>
        </div>
    )
}


export default RoomCard