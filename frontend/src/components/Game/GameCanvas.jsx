import {useEffect, useRef} from "react"
import Phaser from "phaser"
import GameConfig from "../../game/GameConfig"


let gameInstance = null

const GameCanvas = () => {
    const gameRef = useRef(null)

    useEffect(() => {

        if (!gameRef.current) return 

        if (gameRef.current.dataset.initialized) return
        gameRef.current.dataset.initialized = "true"

        if (!gameInstance) {
            gameInstance = new Phaser.Game({
                ...GameConfig,
                parent: gameRef.current
            })
        }

        return () => {
            
        }
    }, [])

    return (
        // // <div className = "relative w-full h-full">
        //     <div ref = {gameRef} className = "absolute inset-0" />
        //  </div>
        <div ref = {gameRef} className = "w-full h-full block" />
    )

}

export default GameCanvas