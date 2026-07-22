const {server, app} = require("./app")
const config = require('../utils/config')



// app.get("/", (req, res) => {
//     res.sendFile("/public/index.html")
// })

server.listen(config.PORT, '0.0.0.0', () => {
    console.log("server running on port 3001")
})