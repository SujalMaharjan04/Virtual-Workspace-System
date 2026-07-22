const getRTCConfig = () => {
    return {
        iceServers: [
            //STUN servers free from google
            {urls: "stun:stun.l.google.com:19302"},
            {urls: "stun:stun1.l.google.com:19302"},

            //TURN server if STUN don't work
            {
                urls: "stun:stun.relay.metered.ca:80",
            },
            {
                urls: "turn:global.relay.metered.ca:80",
                username: "c8999d021ae3ea90fdd38c4f",
                credential: "sXJ9GjScUgUxOvos",
            },
            {
                urls: "turn:global.relay.metered.ca:80?transport=tcp",
                username: "c8999d021ae3ea90fdd38c4f",
                credential: "sXJ9GjScUgUxOvos",
            },
            {
                urls: "turn:global.relay.metered.ca:443",
                username: "c8999d021ae3ea90fdd38c4f",
                credential: "sXJ9GjScUgUxOvos",
            },
            {
                urls: "turns:global.relay.metered.ca:443?transport=tcp",
                username: "c8999d021ae3ea90fdd38c4f",
                credential: "sXJ9GjScUgUxOvos",
            },
        ],
    }
}

module.exports = {getRTCConfig}