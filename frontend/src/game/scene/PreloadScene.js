import Phaser from "phaser";
import Office from "../../assets/map/office.json"
import officePNG from "../../assets/map/office.png"
import office_tiles from "../../assets/map/office_tiles.png"
import avatar1 from "../../assets/sprites/avatar1.png"
import avatar2 from "../../assets/sprites/avatar2.png"



export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene"})
    }

    preload() {

        // Loading Bar UI
        this.createLoadingBar()

        //Load TileMap
        this.load.tilemapTiledJSON("office", Office)

        //Load tileset Image
        this.load.image("officePNG", officePNG)
        this.load.image("office_tiles", office_tiles)

        //Load Avatar spritesheet
        const avatars = [
            {key: "avatar1", path: avatar1},
            {key: "avatar2", path: avatar2}
        ]
        
        avatars.forEach(({key, path}) => {
            this.load.spritesheet(key, path, {
                frameWidth: 64,
                frameHeight: 64
            })
        })
    }

    create() {
        this.scene.start("RoomScene")
    }

    //Loading Bar
    createLoadingBar() {
        const width = this.cameras.main.width
        const height = this.cameras.main.height
        const centerX = width / 2 
        const centerY = height / 2

        //Backgound bar 
        const bgBar = this.add.rectangle(centerX, centerY, 400, 16, 0x252840)

        //Progress Bar
        const progressBar = this.add.rectangle(
            centerX - 200, //Start from left edge
            centerY,
            0, //start at 0 width
            12,
            0x6C63FF
        ).setOrigin(0, 0.5)

        //Loadng text
        const loadingText = this.add.text(centerX, centerY - 30, "Loading....", {
            fontSize: "18px",
            color: "#F1F5F9",
            fontFamily: "Arial",
        }).setOrigin(0.5)

        //Percentage Text
        const percentageText = this.add.text(centerX, centerY + 30, "0%", {
            fontSize: "14px",
            color: "#94A3B8",
            fontFamily: "Arial",
        }).setOrigin(0.5)

        //Update bar as each asset loads
        this.load.on("progress", (value) => {
            progressBar.width = 400 * value
            percentageText.setText(`${Math.round(value * 100)}%`)
        })

        //Clean up loading bar when done
        this.load.on("complete", () => {
            bgBar.destroy()
            progressBar.destroy()
            loadingText.destroy()
            percentageText.destroy()
        })
    }
}

