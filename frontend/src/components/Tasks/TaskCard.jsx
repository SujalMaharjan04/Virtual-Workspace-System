import { useState } from "react"
import useAuthStore from "../../store/authStore"
import useRoomStore from "../../store/roomStore"
import taskService from "../../services/task"

const PRIORITY_STYLES = {
    LOW: "bg-blue-500/20 text-blue-300",
    MEDIUM: "bg-yellow-500/20 text-yellow-300",
    HIGH: "bg-red-500/20 text-red-300"
}

const STATUS_STYLES = {
    PENDING: "bg-gray-500/20 text-gray-300",
    IN_PROGRESS: "bg-purple-500/20 text-purple-300",
    COMPLETED: "bg-green-500/20 text-green-300"
}

const formatDeadline = (deadline) => {
    if (!deadline) return ""
    return new Date(deadline).toISOString().split("T")[0]
}

const displayDeadline = (deadline) => {
    if (!deadline) return "No deadline"
    return new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const ConfirmTick = ({ onClick, isSaving }) => (
    <button
        onClick={onClick}
        disabled={isSaving}
        className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed w-4 h-4 flex items-center justify-center"
        aria-label="Confirm"
    >
        {isSaving
            ? <span className="inline-block w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            : "✓"
        }
    </button>
)

const TaskCard = ({ task }) => {
    const currentUserId = useAuthStore(state => state.user.id)
    const room = useRoomStore(state => state.room)
    const isAdmin = room?.created_by === currentUserId

    const canDelete = isAdmin || task.created_by?.id === currentUserId
    const canEditPriorityDeadline = isAdmin
    const canEditStatus = isAdmin || task.assigned_to?.id === currentUserId

    const [editingField, setEditingField] = useState(null)
    const [pendingValue, setPendingValue] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState(null)

    const startEdit = (field, currentValue) => {
        setEditingField(field)
        setPendingValue(currentValue)
        setError(null)
    }

    const cancelEdit = () => {
        setEditingField(null)
        setPendingValue(null)
        setError(null)
    }

    const confirmEdit = async () => {
        setIsSaving(true)
        setError(null)
        try {
            await taskService.updateTask({ id: task.task_id, [editingField]: pendingValue })
            setEditingField(null)
            setPendingValue(null)
        } catch (err) {
            console.log("Error updating task", err)
            setError("Update failed — try again")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await taskService.deleteTask(task.task_id)
            setShowDeleteConfirm(false)
        } catch (err) {
            console.log("Error deleting task", err)
            setError("Delete failed — try again")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="relative bg-[#22263E] flex flex-col gap-3 w-full p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            {canDelete && (
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-400 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/5"
                    aria-label="Delete task"
                >
                    ✕
                </button>
            )}

            <div className="flex items-start justify-between gap-3 pr-6">
                <h1 className="text-xl font-bold text-white leading-tight">{task.task}</h1>

                {editingField === "priority" ? (
                    <div className="flex items-center gap-1">
                        <select
                            value={pendingValue}
                            onChange={(e) => setPendingValue(e.target.value)}
                            className="text-xs bg-[#1a1d33] text-white rounded px-1 py-1 border border-white/10"
                            autoFocus
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                        {pendingValue !== task.priority && <ConfirmTick onClick={confirmEdit} isSaving={isSaving} />}
                        <button onClick={cancelEdit} disabled={isSaving} className="text-gray-500 hover:text-gray-300 disabled:opacity-50" aria-label="Cancel">✕</button>
                    </div>
                ) : (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${PRIORITY_STYLES[task.priority] ?? "bg-gray-500/20 text-gray-300"} ${canEditPriorityDeadline ? "cursor-pointer hover:opacity-80" : ""}`}
                        onClick={() => canEditPriorityDeadline && startEdit("priority", task.priority)}
                    >
                        {task.priority}
                    </span>
                )}
            </div>

            {task.description && <p className="text-sm text-gray-300 line-clamp-2">{task.description}</p>}

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                {editingField === "deadline" ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="date"
                            value={formatDeadline(pendingValue)}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setPendingValue(e.target.value)}
                            className="text-xs bg-[#1a1d33] text-white rounded px-1 py-1 border border-white/10"
                            autoFocus
                        />
                        {pendingValue !== task.deadline && <ConfirmTick onClick={confirmEdit} isSaving={isSaving} />}
                        <button onClick={cancelEdit} disabled={isSaving} className="text-gray-500 hover:text-gray-300 disabled:opacity-50" aria-label="Cancel">✕</button>
                    </div>
                ) : (
                    <span
                        className={canEditPriorityDeadline ? "cursor-pointer hover:text-gray-200" : ""}
                        onClick={() => canEditPriorityDeadline && startEdit("deadline", task.deadline)}
                    >
                        Due {displayDeadline(task.deadline)}
                    </span>
                )}

                {editingField === "status" ? (
                    <div className="flex items-center gap-1">
                        <select
                            value={pendingValue}
                            onChange={(e) => setPendingValue(e.target.value)}
                            className="text-xs bg-[#1a1d33] text-white rounded px-1 py-1 border border-white/10"
                            autoFocus
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        {pendingValue !== task.status && <ConfirmTick onClick={confirmEdit} isSaving={isSaving} />}
                        <button onClick={cancelEdit} disabled={isSaving} className="text-gray-500 hover:text-gray-300 disabled:opacity-50" aria-label="Cancel">✕</button>
                    </div>
                ) : (
                    <span
                        className={`font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[task.status] ?? "bg-gray-500/20 text-gray-300"} ${canEditStatus ? "cursor-pointer hover:opacity-80" : ""}`}
                        onClick={() => canEditStatus && startEdit("status", task.status)}
                    >
                        {task.status}
                    </span>
                )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-2 mt-1">
                <span>By {task.created_by?.name ?? "Unknown"}</span>
                <span>{task.assigned_to ? `→ ${task.assigned_to.name}` : "Unassigned"}</span>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => !isDeleting && setShowDeleteConfirm(false)}>
                    <div className="bg-[#22263E] rounded-xl p-6 max-w-sm w-full flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-white">Delete this task?</h2>
                        <p className="text-sm text-gray-300">"{task.title}" will be permanently deleted. This can't be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 disabled:opacity-50">Cancel</button>
                            <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white disabled:opacity-50">
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskCard