import {useEffect, useRef} from "react"
import Phaser from "phaser"
import GameConfig from "../../game/GameConfig"
import MessageSection from "./MessageSection"


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
        <div className = "relative w-full h-full overflow-hidden">
            <div ref = {gameRef} className = "absolute inset-0 w-full h-full" />
            <div className = "absolute bottom-5 left-5 z-10 lg:w-[30%] lg:max-h-100 pointer-events-auto ">
                <MessageSection />
            </div>
        </div>
    )

}

export default GameCanvas