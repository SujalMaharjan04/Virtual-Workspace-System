import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Togglable from "../Shared/Togglable"
import RoomForm from "../Room/RoomForm"
import roomService from '../../services/room'
import useRoomStore from "../../store/roomStore"

const Navbar = () => {
    const joinToggleRef = useRef()
    const newToggleRef = useRef()
    const [activeModal, setActiveModal] = useState(null)
    const [error, setErrors] = useState({})
    const [join, setJoin] = useState({
        "roomId": "",
        "password": ""
    })

    const [newRoom, setNewRoom] = useState({
        "roomName": "",
        "password": ""
    })
    const navigate = useNavigate()
    const rooms = useRoomStore(state => state.rooms)
    const setRoom = useRoomStore(state => state.setRoom)
    const setRoomToken = useRoomStore(state => state.setRoomToken)
    const addRooms = useRoomStore(state => state.addRooms)
    const roomMembers = useRoomStore(state => state.roomMembers)
    const addRoomMembers = useRoomStore(state => state.addRoomMembers)


    const handleJoin = (e) => {
        const {name, value } = e.target
        setJoin(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleNew = (e) => {
        const {name, value} = e.target
        setNewRoom(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleJoinSubmit = async(e) => {
        e.preventDefault()
        const errors = {}

        if (!join.roomId) {
            errors.roomId =  "Room Id required"
        }

        if (!join.password) {
            errors.password = "Password Required"
        }

        setErrors(errors)

        if (Object.keys(errors).length === 0) {
            const response = await roomService.joinRoom(join)

            if (!response.success) {
                return 
            }
            setRoom(response.data.room)
            setRoomToken(response.data.token)
            const roomExist = rooms.some(r => r.room_id === response.data.room.room_id)
            const memberExist = roomMembers.some(r => r.id === response.data.member.user_id)

            if (!roomExist) {
                addRooms(response.data.room)
            }
            console.log(memberExist)
            if (!memberExist) {
                addRoomMembers(response.data.member)
            }

            joinToggleRef.current.close()
            navigate(`/${response.data.room.room_id}`)
            
        }
        
        setJoin({
            "roomId": "",
            "password": ""
        })
    }

    const handleNewSubmit = async(e) => {
        e.preventDefault()
        const errors = {}

        if (!newRoom.roomName) {
            errors.roomName = "Room Name required"
        }

        if (!newRoom.password) {
            errors.password = "Password required"
        }

        setErrors(errors)

        if (Object.keys(errors).length === 0) {
            const response = await roomService.createRoom(newRoom)
            if (!response.success) {
                return 
            }
            setRoom(response.data.room)
            setRoomToken(response.data.token)
            addRooms(response.data.room)
            newToggleRef.current.close()
            navigate(`/${response.data.room.room_id}`)
        }

        setNewRoom({
            "roomName": "",
            "password": ""
        })
    }


    return (
        <div className = "flex justify-between items-start m-6">
            <div className = "w-[50%]">
                <h1 className = "font-bold text-4xl">Virtual Workspace</h1>
            </div>
            <div className = " flex justify-end items-center text-[#F1F5F9] w-full gap-6">
                <Togglable ref = {joinToggleRef} buttonClass = "roomButton" buttonLabel = "Join" isOpen = {activeModal === 'join'} onOpen = {() => setActiveModal("join")} onClose = {() => setActiveModal(null)}>
                    <RoomForm topic = "Join A Room" name1 = "roomId" label1 = "Room Id" input1 = {join.roomId} error1 = {error.roomId} error2 = {error.password} input2 = {join.password} handleInput = {handleJoin} handleSubmit={handleJoinSubmit} />
                </Togglable>
                <Togglable ref = {newToggleRef} buttonClass = "roomButton" buttonLabel = "New +" isOpen = {activeModal === 'new'} onOpen = {() => setActiveModal("new")} onClose = {() => setActiveModal(null)}>
                    <RoomForm topic = "Create A Room" name1 = "roomName" label1 = "Room Name" input1 = {newRoom.roomName} error1 = {error.roomName} error2 = {error.password} input2 = {newRoom.password} handleInput = {handleNew} handleSubmit = {handleNewSubmit} />
                </Togglable>
            </div>
        </div>
    )
}

export default Navbar