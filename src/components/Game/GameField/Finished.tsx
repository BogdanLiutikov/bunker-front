import type {gameState} from "../Game";

export function Finished({gameState}: { gameState: gameState }) {
    return (
        <div className="finished wrapper-center">
            <div className="info game-status">
                Игра окончена
            </div>
            <div className="info">
                В бункер попали:
            </div>
            <div className="winners">
                {gameState?.players.map(({userName, outOfGame}) => (
                    !outOfGame && <div className="player">{userName}</div>
                ))}
            </div>
        </div>
    )
}