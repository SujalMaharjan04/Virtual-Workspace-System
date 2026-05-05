import useNotificationStore from "../../store/notificationStore"
import { useEffect } from "react"


const Notification = () => {
    const message = useNotificationStore(state => state.message)
    const type = useNotificationStore(state => state.type)
    const clearNotification = useNotificationStore(state => state.clearNotification)

    useEffect(() => {
        let timer
        if (message) {
            timer = setTimeout(() => {
                clearNotification()
            }, 3000)
        }
        return () => clearTimeout(timer)
        
    }, [message, clearNotification])

    if (!message) {
        return null
    }

    return (
        <div className = {`notification ${type === "success" ? "notification-success" : "notification-error"}`}>
            <p>{message}</p>
        </div>
    )
}

export default Notification