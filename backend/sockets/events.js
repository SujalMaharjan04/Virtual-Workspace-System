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


module.exports = {ROOM_EVENTS, MESSAGE_EVENTS}