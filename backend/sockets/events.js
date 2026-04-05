const ROOM_EVENTS = {
    ADMIN_JOINED: "room:admin_joined",
    INACTIVE: "room:inactive",
    JOIN: "room:join",
    LEAVE: "room:leave",
    JOINED: "room:joined",
    USER_JOINED: "room:user_joined",
    USER_LEFT: "room:user_left",
    MEMBERS: "room:members",
    ERROR: "room:error"
}

const MESSAGE_EVENTS = {
    SEND_ALL: "message",
    SEND_DM: "direct-message",
    RECEIVE_DM: "receive-dm"
}

const AVATAR_EVENTS = {
    MOVE: "avatar:move",
    DISPLAY: "avatar-moved",
    POSITION: "avatar-position"
}

const TASK_EVENTS = {
    TASK_CREATED: "task-created",
    TASK_UPDATED: "task-updated",
    TASK_DELETED: "task-deleted"
}

module.exports = {ROOM_EVENTS, MESSAGE_EVENTS, AVATAR_EVENTS, TASK_EVENTS}