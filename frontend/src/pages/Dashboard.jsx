
import useRoomStore from "../store/roomStore"

import Navbar from "../components/Navbar"
const DashBoard = () => {
    
    const rooms = useRoomStore(state => state.rooms)
    const token = useRoomStore(state => state.token)
    
    return (
        <div className = "flex flex-col">
            
            <Navbar />
            <div className = "flex justify-around items-center">
                <div className = "flex flex-col justify-center items-center w-[25%] min-h-50 max-h-full overflow-y-auto rounded-2xl bg-[#252840] gap-6">
                    <div>
                        <h2 className = "font-bold underline text-2xl">Rooms</h2>
                    </div>

                    {rooms && rooms.length > 0 
                        ? <div>
                            <ul>
                                {rooms.map(r => (
                                    <li><span className = "flex gap-2"><p className = {`${r.isActive ? "bg-green-500" : "bg-red-500"} rounded-full w-6 h-6`}></p>{r.name}</span></li>
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