require('dotenv').config()

const SECRET = process.env.SECRET

const DATABASE_URL = process.env.DATABASE_URL

const DIRECT_URL = process.env.DIRECT_URL

const PORT = process.env.PORT

const FRONTEND = process.env.FRONTEND


module.exports = {SECRET, DATABASE_URL, DIRECT_URL, PORT, FRONTEND}