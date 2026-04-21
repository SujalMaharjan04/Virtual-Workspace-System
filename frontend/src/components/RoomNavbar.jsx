import useRoomStore from "../store/roomStore"


const RoomNavbar = () => {
    const room = useRoomStore(state => state.room)
    return (
        <div className = "bg-[#1A1D2E] flex justify-between items-center w-full">
            <div className = "m-8 w-[50%]">
                <h1 className = "font-bold text-3xl">{room.room_name}</h1>
            </div>
            
            <div className = " flex justify-end items-center  w-full">
                <div className = "w-[15%]">
                    <button className = "submitBtn">Inbox</button>
                </div>

                <div className = "w-[15%]">
                    <button className = "submitBtn">Members</button>
                </div>

                <div className = "w-[15%]">
                    <button className = "submitBtn">Tasks</button>
                </div>
            </div>
        </div>
    )
}

export default RoomNavbar