const app = require("./app")
const config = require('../utils/config')
const http = require('http')
const { Server } = require('socket.io')

const server = http.createServer(app)
const io = new Server(server)

io.on("connection", (socket) => {
    console.log("you have connected to websocket", socket.id)
})

app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>")
})

server.listen(config.PORT, () => {
    console.log("server running on port 3001")
})