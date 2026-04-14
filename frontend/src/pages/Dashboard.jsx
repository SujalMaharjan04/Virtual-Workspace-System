import useRoomStore from "../store/roomStore"

const DashBoard = () => {
    const room = useRoomStore(state => state.room)
    const token = useRoomStore(state => state.token)
    return (
        <div className = "flex flex-col">
            <div className = "flex justify-between items-start m-6 ">
                <div>
                    <h1 className = "font-bold text-4xl ml-12">Virtual Workspace</h1>
                </div>
                <div className = "flex justify-end items-center text-[#F1F5F9] w-[50%] gap-6">
                    <button className = "bg-[#02798E] w-[20%] h-12 text-2xl rounded-2xl hover:cursor-pointer hover:bg-[#0098a9]" type = "button">Join</button>
                    <button className = "bg-[#02798E] w-[20%] h-12 text-2xl rounded-2xl hover:cursor-pointer hover:bg-[#0098a9]" type = "button">New + </button>
                </div>
            </div>

            <div className = "flex justify-around items-center">
                <div className = "flex flex-col justify-center items-center w-[25%] min-h-50 max-h-full overflow-y-auto rounded-2xl bg-[#252840] gap-6">
                    <div>
                        <h2 className = "font-bold underline text-2xl">Rooms</h2>
                    </div>

                    {room && token 
                        ? <div>
                            <ul>
                                {room.map(r => (
                                    <li><span><p className = {`${r.isActive ? "bg-green-500" : "bg-red-500"} rounded-full`}></p>{r.name}</span></li>
                                ))}
                            </ul>
                        </div>
                        : <div>
                            <p>No room Found</p>
                          </div>}
                </div>

                <div>
                    Hello
                </div>

            </div>
        </div>
    )
}

export default DashBoard