import { useState } from "react"
import avatar1 from "../../assets/sprites/avatar1.png"
import avatar2 from "../../assets/sprites/avatar2.png"
import useAuthStore from "../../store/authStore"

const AVATARTS = [
    {id: "avatar1", path: avatar1, name: "Character 1"},
    {id: "avatar2", path: avatar2, name: "Character 2"}
]

const AvatarSelection = ({onSelect}) => {
    const setAvatarId = useAuthStore.getState().setAvatarId
    const [selected, setSelected] = useState(null)
    // const navigate = useNavigate()
    
    const handleSelect = (avatarId) => {
        setSelected(avatarId)
    }

    const handleComfirm = () => {
        if (!selected) return 
        setAvatarId(selected)
        onSelect?.()
    }
    return(
        <div className = "flex justify-center items-center w-screen">
            <div className = "bg-[#0F1117] h-screen flex flex-col items-center justify-center gap-8">
                <h2 className = "text-[#F1F5F9] font-bold text-3xl">Choose Your Avatar</h2>

                <div className = "flex gap-6">
                    {AVATARTS.map(avatar => (
                        <div key = {avatar.id} className = {`flex flex-col items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${selected === avatar.id ? 'border-[#6C63FF] bg-[#6C63FF22]' : 'border-[#2E3153] bg-[#1A1D2E]'}`} onClick={() => handleSelect(avatar.id)}>
                            {/*Avatar Preview */}
                            <div style = {{
                                width: '128px',
                                height: '128px',
                                backgroundImage: `url(${avatar.path})`,
                                backgroundPosition: '0px 0px',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1024px auto',
                                imageRendering: 'pixelated'
                            }}>
                                <span className = "text-[#94A3B8] text-sm">
                                    {avatar.name}
                                </span> 
                                {selected === avatar.id && (
                                    <span className = "text-[#6C63FF] text-xs font-medium">
                                        Selected
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick = {handleComfirm} disabled = {!selected} className = {`px-8 py-3 rounded-xl font-medium transition-color ${selected ? 'bg-[#6C63FF] text-white cursor-pointer hover:bg-[#5A52E0]' : 'bg-[#252840] text-[#4A5568] cursor-not-allowed' }`}>
                    Enter Room
                </button>
            </div>
        </div>
    )
}

export default AvatarSelection