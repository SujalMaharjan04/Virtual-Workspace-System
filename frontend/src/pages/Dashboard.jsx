import useAuthStore from "../store/authStore"
import useRoomStore from "../store/roomStore"
import RoomCard from "../components/RoomCard"

import Navbar from "../components/Navbar"
const DashBoard = () => {
    const user = useAuthStore(state => state.user)
    const rooms = useRoomStore(state => state.rooms)
    
    return (
        <div className = "flex flex-col">
            
            <Navbar />
            <div className = "flex justify-start items-center mx-24 mt-12">
                <div className = "flex flex-col justify-center items-center w-[25%] min-h-50 max-h-full overflow-y-auto rounded-2xl bg-[#252840] gap-6 mr-24">
                    <div>
                        <h2 className = "font-bold underline text-2xl">Rooms</h2>
                    </div>

                    {rooms && rooms.length > 0 
                        ? <div>
                            <ul>
                                {rooms.map(r => (
                                    <li key = {r.room_id}><span className = "flex justify-center items-center gap-2"><p className = {`${r.is_active ? "bg-green-500" : "bg-red-500"} rounded-full w-3 h-3`}></p>{r.room_name}</span></li>
                                ))}
                            </ul>
                        </div>
                        : <div>
                            <p>No room Found</p>
                          </div>}
                </div>

                <div className = "flex flex-col justify-center items-start gap-8">
                    <div>
                        <h1 className = "font-bold text-3xl">Welcome, {user.name}</h1>
                    </div>

                    <div>
                        <h2 className = "text-2xl">Your Rooms</h2>
                    </div>

                    {rooms && rooms.length > 0
                    ? <div className = "flex justify-around items-center w-full gap-6">
                        {rooms.map(r => (
                            <RoomCard name = {r.room_name} key = {r.id} maxCapacity = {r.max_capacity} id = {r.room_id} />
                        ))}
                    </div>
                    : ""}


                </div>

            </div>
        </div>
    )
}

export default DashBoard