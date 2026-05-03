import useRoomStore from "../store/roomStore"


const MemberList = () => {
    const roomMembers = useRoomStore(state => state.roomMembers)
    
    return (
        <div className = "flex flex-col h-full">
            <div className = "flex flex-col items-center gap-4 flex-1 overflow-y-auto py-6 w-full">
                {roomMembers.map(member => (
                    <div className = "flex justify-around items-center gap-4 w-[50%]">
                        <span className = "flex justify-center items-center gap-2"><p className = {`${member.is_active ? "bg-green-500" : "bg-red-500"} rounded-full w-3 h-3`}></p>{member.user.name}</span>
                        <button className = "w-[20%] h-12 rounded-2xl hover:cursor-pointer hover:bg-red-500 bg-red-700">Kick</button>
                    </div>
                ))}
            </div>

            <div className = "flex justify-between items-center gap-8 w-[50%] mx-auto py-6 mt-auto">
                <button className = "submitBtn">Send the Invite Link</button>
                <button className = "submitBtn">Get Room Id</button>
            </div>

        </div>
    )
}

export default MemberList