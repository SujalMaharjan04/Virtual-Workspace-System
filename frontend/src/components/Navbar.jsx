import { useState } from "react"
import Togglable from "./Togglable"
import RoomForm from "./RoomForm"

const Navbar = () => {
    const [activeModal, setActiveModal] = useState(null)
    const [join, setJoin] = useState({
        "roomId": "",
        "password": ""
    })

    const [newRoom, setNewRoom] = useState({
        "roomName": "",
        "password": ""
    })

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

    const handleJoinSubmit = (e) => {
        e.preventDefault()
        console.log(join)
        
        setJoin({
            "roomId": "",
            "password": ""
        })
    }

    const handleNewSubmit = (e) => {
        e.preventDefault()
        console.log(newRoom)

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
                <Togglable buttonClass = "roomButton" buttonLabel = "Join" isOpen = {activeModal === 'join'} onOpen = {() => setActiveModal("join")} onClose = {() => setActiveModal(null)}>
                    <RoomForm topic = "Join A Room" name1 = "roomId" label1 = "Room Id" input1 = {join.roomId} input2 = {join.password} handleInput = {handleJoin} handleSubmit={handleJoinSubmit} />
                </Togglable>
                <Togglable buttonClass = "roomButton" buttonLabel = "New +" isOpen = {activeModal === 'new'} onOpen = {() => setActiveModal("new")} onClose = {() => setActiveModal(null)}>
                    <RoomForm topic = "Create A Room" name1 = "roomName" label1 = "Room Name" input1 = {newRoom.roomName} input2 = {newRoom.password} handleInput = {handleNew} handleSubmit = {handleNewSubmit} />
                </Togglable>
            </div>
        </div>
    )
}

export default Navbar