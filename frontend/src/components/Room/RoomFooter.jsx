import roomService from "../../services/room"
import useNotificationStore from "../../store/notificationStore"
import useRoomStore from "../../store/roomStore"
import useAuthStore from "../../store/authStore"

const RoomFooter = () => {
    const setNotification = useNotificationStore(state => state.setNotification)
    const leave = useRoomStore(state => state.leave)
    const {user} = useAuthStore.getState()
    const userId = user.id
    const {room} = useRoomStore.getState()
    const roomId = room.room_id

    const handleLeave = async() => {
        const response = await roomService.leaveRoom()

        if (!response.success) {
            setNotification(response.data)
            return
        }

        leave({userId, roomId})
        setNotification("Room Left")

    }
    return (
        <div className = "bg-[#1A1D2E] flex justify-between items-center w-full h-16">
            <div className = "m-6">
                <h2 className = "font-semibold text-2xl">WASD/Arrow key to move</h2>
            </div>

            <div className = "flex justify-end items-center w-[50%] m-6">
                <button className = "bg-red-500 w-[20%] h-12 rounded-2xl hover:cursor-pointer hover:bg-red-400" onClick = {handleLeave}>Leave</button>
            </div>
        </div>
    )
}

export default RoomFooter