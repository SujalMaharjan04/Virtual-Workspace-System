import { forwardRef, useImperativeHandle } from "react"
import {createPortal} from "react-dom"

const Togglable = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        close() {
            props.onClose()
        }
    }))
    return (
        <div className = "relative">
            <div>
                <button className = {props.buttonClass} onClick = {props.onOpen}>
                    {props.buttonLabel}
                </button>
            </div>

            {props.isOpen && createPortal(
                    <div className = "fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                        <div className = "bg-[#0F1117] w-[50%] min-h-[50%] h-full max-h-[70%] overflow-hidden rounded-2xl p-6 shadow-lg relative  " onClick = {(e) => e.stopPropagation()}>  {/* h-full is added to give the container a height so that its child can extend to only that container when using h-screen and overflow-hidden to prevent the parent div from overflowing */}
                            {props.children}
                            <button className = "absolute top-2 right-3 text-grey-600 text-xl" onClick = {props.onClose}>
                                ✕
                            </button>
                        </div>
                    </div>
                , document.body)
            }
        </div>
    )
})


export default Togglable