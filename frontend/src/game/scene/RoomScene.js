import Phaser from "phaser";

export default class RoomScene extends Phaser.Scene {
    constructor() {
        super({key: "RoomScene"})

        this.localPlayer = null
        this.playerLabel = null
        this.cursors = null
        this.wasd = null
        this.lastDirection = "down"
        this.lastEmitTime = 0

        this.otherPlayer = {}

        this.floorLayer = null
        this.objectLayer = null
        this.aboveLayer = null
    }

    create() {
        this.createMap()
        this.createLocalPlayer()
        this.createAnimation()
        this.setupCamera()
        this.setupInput()
    }

    update() {
        this.handleMovement()
        this.updateLabelPosition()
        this.updateOtherPlayer()
    }


    createMap() {
        const map = this.make.tilemap({key: "office"})

        const tileset = map.addTilesetImage("VOF-1", "office_tiles", 32, 32)

        //Layers
        this.bottomLayer = map.createLayer("Bottom Layer", tileset, 0, 0)
        this.topLayer = map.createLayer("Top Layer", tileset, 0, 0)
        this.topLayer2 = map.createLayer("top layer 2", tileset, 0, 0)
        this.topLayer3 = map.createLayer("top layer 3", tileset, 0, 0)

        this.createObjectCollider(map)

        //set world bounds to map size
        this.physics.world.setBounds(
            0, 0,
            map.widthInPixels,
            map.heightInPixels
        )

        this.map = map
    }

    createObjectCollider(map) {
        const collisionLayer = [
            "Shelves",
            "Table",
            "Workstation",
            "Chair",
            "FlowerPot",
            "FlowerPot2",
            "Barrier1",
            "Barrier2",
            "Boundary",
            "Door",
            "Door2",
            "NoticeBoard"
        ]

        this.colliders = [] //store all border

        collisionLayer.forEach(layerName => {
            const objectLayer = map.getObjectLayer(layerName)
            if (!objectLayer) return

            objectLayer.objects.forEach(obj => {
                if (obj.polygon) {
                    const bounds = this.getPolygonBounds(obj.polygon)
                    const body = this.physics.add.staticImage(
                        obj.x + bounds.x + bounds.width / 2,
                        obj.y + bounds.y + bounds.height / 2,
                        null
                    )
                    body.setVisible(false)
                    body.body.setSize(bounds.width, bounds.height)
                    body.refreshBody()
                    this.colliders.push(body)
                }
            })


        })
    }

    //Helper - Get Bounding box of the polygon
    getPolygonBounds(polygon) {
        const xs = polygon.map(p => p.x)
        const ys = polygon.map(p => p.y)
        const minX = Math.min(...xs)
        const minY = Math.min(...ys)
        const maxX = Math.max(...xs)
        const maxY = Math.max(...ys)
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        }
    }

    createLocalPlayer() {
        const avatarId = localStorage.getItem("avartarId") || "avatar1"
        const userName = localStorage.getItem("logged").state.user.name || "You"

        const spawnLayer = this.map.getObjectLayer("Spawn")
        const spawnObject = spawnLayer?.objects.find(obj => obj.properties?.find(p => p.name === "Spawn" && p.value === true))

        const spawnX = spawnObject ? spawnObject.x + spawnObject.width / 2 : 610
        const spawnY = spawnObject ? spawnObject.y + spawnObject.height / 2 : 864
        

        this.localPlayer = this.physics.add.sprite(spawnX, spawnY, avatarId)
        this.localPlayer.setCollideWorldBounds(true)
        this.localPlayer.setDepth(5)
        this.localPlayer.avatarId = avatarId

        this.physics.add.collider(this.localPlayer, this.colliders)

        this.playerLabel = this.add.text(spawnX, spawnY - 30, userName, {
            fontSize: "10px",
            color: "#F1F5F9",
            backgroundColor: "#000088",
            padding: {x: 4, y: 2},
        }).setOrigin(0.5).setDepth(6)
    }

    createAnimation() {
        const avatars = ["avatar1", "avatar2", "avatar3"]
        const directions = [
            {key: "down", row: 0},
            {key: "left", row: 1},
            {key: "right", row: 2},
            {key: "up", row: 3}
        ]
        avatars.forEach(avatarId => {
            directions.forEach(({key, row}) => {
                const walkKey = `${avatarId} - walk -${key}`
                if (!this.anims.exists(walkKey)) {
                    this.anims.create({
                        key: walkKey,
                        frames: this.anims.generateFrameNumbers(avatarId, {
                            start: row * 9 + 1,
                            end: row * 9 + 8
                        }),
                        frameRate: 8,
                        repeat: -1,
                    })
                }

                const idleKey = `${avatarId}-idle-${key}`
                if (!this.anims.exists(idleKey)) {
                    this.anims.create({
                        key: idleKey,
                        frames: [{key: avatarId, frame: row * 9}],
                        frameRate: 1,
                        repeat: -1
                    })
                }
            })
        })
    }

    setUpCamera() {
        this.cameras.main.setZoom(1.5)
        this.cameras.main.startFollow(
            this.localPlayer,
            true,  //round pixels - prevent blurry rendering
            0.1,   //lerp x - smoothness (0.1 = smooth, 1 = instant)
            0.1    //lerp y
        )
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys()

        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })
    }

    handleMovement() {
        const player = this.localPlayer
        const avatarId = player.avatarId
        const speed = 120
        let moved = false
        let direction = this.lastDirection

        player.setVelocity(0)

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            player.setVelocityX(-speed)
            player.anims.play(`${avatarId}-walk-left`, true)
            direction = "left"
            moved = true
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            player.setVelocityX(speed)
            player.anims.play(`${avatarId}-walk-right`, true)
            direction = "right"
            moved = true
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            player.setVelocityY(-speed)
            if (!moved) player.anims.play(`${avatarId}-walk-up`, true)
            direction = "up"
            moved = true
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            player.setVelocityY(speed) 
            if (!moved) player.anims.play(`${avatarId}-walk-down`, true)
            direction = "down"
            moved = true
        }

        if (!moved) {
            player.anims.play(`${avatarId}-idle-${this.lastDirection}`, true)
            player.setVelocity(0)
        }

        this.lastDirection = direction


        if (moved) {
            const now = Date.now()
            if (now - this.lastEmitTime > 50) {
                this.lastEmitTime = now
                this.emitPosition(player.x, player.y, direction)
            }
        }
    }

    emitPosition({x, y, direction}) {
        console.log("Position", {x, y, direction})
    }

    updateLabelPosition() {
        if (this.playerLabel && this.localPlayer) {
            this.playerLabel.setPosition(
                this.localPlayer.x,
                this.localPlayer.y - 30
            )
        }
    }

    updateOtherPlayer() {
        Object.values(this.otherPlayer).forEach(({sprite, label, targetX, targetY}) => {
            if (targetX === undefined) return

            sprite.x = Phaser.Math.Linear(sprite.x, targetX, 0.2)
            sprite.y = Phaser.Math.Linear(sprite.y, targetY, 0.2)

            label.setPosition(sprite.x, sprite.y - 30)
        })
    }

    spawnOtherPlayer({userId, x, y, avatarId, userName}) {
        if (this.otherPlayer[userId]) return 

        const sprite = this.physics.add.sprite(x, y, avatarId)
        sprite.setDepth(5)
        sprite.avatarId = avatarId

        const label = this.add.text(x, y - 30, userName, {
            fontSize: "10px",
            color: "#F1F5F9",
            backgroundColor: "#000088",
            padding: {x: 4, y: 2}
        }).setOrigin(0.5).setDepth(6)

        this.otherPlayer[userId] = {sprite, label, targetX: x, targetY: y}
    }

    //This function is called by socket handler
    moveOtherPlayer({userId, x, y, direction, avatarId}) {
        const player = this.otherPlayer[userId]
        if (!player) return

        player.targetX = x
        player.targetY = y

        const id = avatarId || player.sprite.avatarId
        player.sprite.anims.play(`${id}-walk-${direction}`, true)
    }


    //This function is called during socket disconnect
    removeOtherPlayer(userId) {
        const player = this.otherPlayer[userId]
        if (!player) return

        player.sprite.destroy()
        player.label.destroy()
        delete this.otherPlayer[userId]
    }

    checkProximity() {
        const localX = this.localPlayer.x
        const localY = this.localPlayer.y

        const THRESHOLD = 80

        Object.entries(this.otherPlayer).forEach(([userId, {sprite}]) => {
            const distance = Phaser.Math.Distance.Between(
                localX, localY,
                sprite.x, sprite.y
            )

            if (distance < THRESHOLD) {
                console.log(`Near Player ${userId}, distance: ${distance}`)
            }
        })
    }
}