const getRTCConfig = () => {
    return {
        iceServers: [
            //STUN servers free from google
            {urls: "stun:stun.l.google.com:19302"},
            {urls: "stun:stun1.l.google.com:19302"},

            //TURN server if STUN don't work
            {
                urls: "turn:numb.viagenie.ca",
                username: "webrtc@live.com",
                credential: "muazkh"
            }
        ]
    }
}

module.exports = {getRTCConfig}