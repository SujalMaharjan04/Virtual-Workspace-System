import Phaser from "phaser"
import PreloadScene from "./scene/PreloadScene"
import RoomScene from "./scene/RoomScene"


const GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#1A1D2E",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: [PreloadScene, RoomScene]
}

export default GameConfig