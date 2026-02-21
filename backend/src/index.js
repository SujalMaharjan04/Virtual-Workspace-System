const app = require("./app")
const config = require('../utils/config')
const http = require('http')

const { initializeSocket } = require("../sockets/socket")

const server = http.createServer(app)
initializeSocket(server)


app.get("/", (req, res) => {
    res.sendFile("/public/index.html")
})

server.listen(config.PORT, () => {
    console.log("server running on port 3001")
})