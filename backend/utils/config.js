require('dotenv').config()

const SECRET = process.env.SECRET

const DATABASE_URL = process.env.DATABASE_URL

const DIRECT_URL = process.env.DIRECT_URL

const PORT = process.env.PORT


module.exports = {SECRET, DATABASE_URL, DIRECT_URL, PORT}