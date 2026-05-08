import {useEffect, useRef} from "react"
import Phaser from "phaser"
import GameConfig from "../../game/GameConfig"


const GameCanvas = () => {
    const gameRef = useRef(null)

    useEffect(() => {

        if (!gameRef.current) return 

        if (gameRef.current.dataset.initialized) return
        gameRef.current.dataset.initialized = "true"

        const game = new Phaser.Game({
            ...GameConfig,
            parent: gameRef.current
        })

        return () => {
            game.destroy(true)
        }
    }, [])

    return (
        <div className = "relative w-screen h-screen">
            <div ref = {gameRef} className = "absolute inset-0" />
        </div>
    )

}

export default GameCanvas