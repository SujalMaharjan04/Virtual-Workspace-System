const prisma = require('../src/db')
const supertest = require("supertest")
const {app, server: appServer} = require('../src/app')
const {before, after, beforeEach, describe, test} = require('node:test')
const assert = require("node:assert")
const helper = require("./test_helper")
const api = supertest(app)
const Client = require("socket.io-client")
const http = require("http")

let server, clientSocket, port

before(async() => {
    await new Promise((resolve, reject) => {
        appServer.listen(3001, () => {
            port = appServer.address().port
            resolve()
        })
    })
})

beforeEach(async() => {
    if (clientSocket) {
        clientSocket.disconnect()
        clientSocket = null
    }
    await prisma.room.deleteMany({})
    await prisma.user.deleteMany({})

    const newUser = {
        name: "Bob",
        password: "123456",
        email: "bob@gmail.com"
    }

    await api.post('/api/auth/signup').send(newUser).expect(201).expect("Content-type", /application\/json/)
})

after(async() => {
    if (clientSocket) clientSocket.disconnect()
    appServer.close()
    await prisma.$disconnect()
})


describe("Testing for the rooms", () => {
    test('should create a room', async() => {
        
        const roomAtStart = await helper.roomInDb()
        const loginInfo = {
            email: "bob@gmail.com",
            password: "123456"
        }

        const response = await api.post("/api/auth/login").send(loginInfo).expect(201).expect("Content-type", /application\/json/)
        const newRoom = {
            name: "Bob's Room",
            password: "123456"
        }

        const room = await api.post("/api/room/createroom").send(newRoom).set('Authorization', `Bearer ${response.body.token}`).expect(201).expect("Content-type", /application\/json/)

        const roomNow = await helper.roomInDb()
        assert.strictEqual(roomNow.length, roomAtStart.length + 1)
        assert.ok(room.body.room.id)
    })
})

describe("Testing Socket.io", () => {
    // test("Should connect to socket with valid token", async() => {
    //     const loginInfo = {
    //         email: "bob@gmail.com",
    //         password: "123456"
    //     }

    //     const response = await api
    //                         .post("/api/auth/login")
    //                         .send(loginInfo)

    //     const token = response.body.token

    //     await new Promise((resolve, reject) => {
    //         clientSocket = new Client(`http://localhost:${port}`, {
    //             auth: {token}
    //         })

    //         clientSocket.on("connect", () => {
    //             assert.strictEqual(clientSocket.connected, true)
    //             resolve()
    //         })

    //         clientSocket.on("connect_error", (err) => {
    //             reject(err)
    //         })
    //         })
    // })

    test('Should join the room', async() => {
        const loginUser = {
            email: "bob@gmail.com",
            password: "123456"
        }

        const user = await api.post("/api/auth/login").send(loginUser).expect(201).expect("Content-type", /application\/json/)

        const newRoom = {
            name: "Bob's Room",
            password: "123456"
        }

        const room = await api.post("/api/room/createroom").send(newRoom).set("Authorization", `Bearer ${user.body.token}`).expect(201).expect("Content-type", /application\/json/)

        const roomId = room.body.room.id

        const joinRoom = {
            roomId,
            password: "123456"
        }

        const joinedRoom = await api.post("/api/room/join").set("Authorization", `Bearer ${user.body.token}`).send(joinRoom).expect(200).expect("Content-type", /application\/json/)
        
        assert.ok(joinedRoom.body.token)

    })

    test("after joining the room, socket connection is established", async() => {
        const loginUser = {
            email: "bob@gmail.com",
            password: "123456"
        }

        const user = await api.post("/api/auth/login").send(loginUser).expect(201).expect("Content-type", /application\/json/)

        const newRoom = {
            name: "Bob's Room",
            password: "123456"
        }

        const room = await api.post("/api/room/createroom").send(newRoom).set("Authorization", `Bearer ${user.body.token}`).expect(201).expect("Content-type", /application\/json/)

        const roomId = room.body.room.id

        const joinRoom = {
            roomId,
            password: "123456"
        }

        const joinedRoom = await api.post("/api/room/join").set("Authorization", `Bearer ${user.body.token}`).send(joinRoom).expect(200).expect("Content-type", /application\/json/)
        const token = joinedRoom.body.token
        
        await new Promise((resolve, reject) => {
            const timeOut = setTimeout(() => reject(new Error("Connection timed out")), 5000)
            clientSocket = new Client(`http://localhost:${port}`, {
                auth: {token}
            })

            clientSocket.on("connect", () => {
                clearTimeout(timeOut)
                assert.strictEqual(clientSocket.connected, true)
                resolve()
            })

            clientSocket.on("connect_error", (err) => {
                clearTimeout(timeOut)
                reject(err)
            })
        })
    })
    
    test("socket connection should fail with wrong token or if the user doesn't enter the room", async() => {
        const loginUser = {
            email: "bob@gmail.com",
            password: "123456"
        }

        const user = await api.post("/api/auth/login").send(loginUser).expect(201).expect("Content-type", /application\/json/)

        const token = user.body.token

        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Connection timed out")), 5000)

            clientSocket = new Client(`http://localhost:${port}`, {
                auth: {token}
            })

            clientSocket.on("connect", () => {
                clearTimeout(timeout)
                assert.strictEqual(clientSocket.connected, true)
                reject(new Error("Should not connect"))
            })

            clientSocket.on("connect_error", () => {
                clearTimeout(timeout)
                resolve()
            })
        })
    })
})
