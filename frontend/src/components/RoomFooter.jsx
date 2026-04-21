
const RoomFooter = () => {
    return (
        <div className = "bg-[#1A1D2E] flex justify-between items-center w-full h-16">
            <div className = "m-6">
                <h2 className = "font-semibold text-2xl">WASD/Arrow key to move</h2>
            </div>

            <div className = "flex justify-end items-center w-[50%] m-6">
                <button className = "bg-red-500 w-[20%] h-12 rounded-2xl hover:cursor-pointer hover:bg-red-400">Leave</button>
            </div>
        </div>
    )
}

export default RoomFooter