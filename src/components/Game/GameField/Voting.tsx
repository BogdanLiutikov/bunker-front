import React, {useContext, useState} from "react";

import type {gameState} from "../Game";
import {WsContext} from "../../../App";
import {getCookie} from "../../../utils/Cookie";
import {GameLinkContext} from "../Games";


export function Voting({gameState}: { gameState: gameState }) {

    const [vote, setVote] = useState<string>()
    const ws = useContext(WsContext);
    const gameId = useContext(GameLinkContext)


    function handleVoteClick(e: React.MouseEvent<HTMLButtonElement>) {
        const token = getCookie("token")
        setVote((e.target as HTMLButtonElement).value)
        ws?.send(JSON.stringify({
            method: "vote",
            userId: token,
            toPlayer: (e.target as HTMLButtonElement).value
        }))

        ws?.send(JSON.stringify({
            method: "updateGameState",
            userId: token,
            gameId: gameId
        }))
    }

    return (
        <div className="voting wrapper-center">
            <div className="info game-status">Идет этап голосования</div>
            {/*//todo вернуть время оставшееся на голосование*/}
            {/*<div className="current-move">Осталось времени на голосование {gameState.timeToMove} секунд</div>*/}
            {!gameState.you.outOfGame
                ?
                <div className="candidate">
                    <div>Выберите игрока, которого хотите изгнать</div>
                    <div className="voting-table">
                        <ul>
                            {gameState.players.map(({userName, outOfGame}) => (
                                <li key={userName} className="player">
                                    {<button onClick={handleVoteClick}
                                             disabled={userName === vote || outOfGame}
                                             value={userName}>{userName}</button>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                : <div className="info">
                    Вы выбыли и не можете голосовать
                </div>
            }
        </div>
    )
}