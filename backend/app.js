const express = require('express')

const app = express()


app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>")
})

module.exports = app