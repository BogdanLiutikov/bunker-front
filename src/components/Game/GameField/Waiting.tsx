import {useContext, useEffect, useState} from "react";

import {ErrorContext} from "../Game";
import {GameLinkContext} from "../Games";

import type {gameState} from "../Game"
import {WsContext} from "../../../App";
import {readyCheck} from "../../../utils/Request";
import {getCookie} from "../../../utils/Cookie";

export function Waiting({gameState}: { gameState: gameState }) {

    const gameId = useContext(GameLinkContext);
    const [error, setError] = useContext(ErrorContext);
    const [readyState, setReadyState] = useState<number | undefined>();
    const ws = useContext(WsContext);

    let tryCount = 0;


    useEffect(() => {
        if (ws !== null) {
            if (readyCheck(ws, tryCount, setReadyState) === WebSocket.OPEN) {
                // ws.onmessage = (message) => {
                //     const content = JSON.parse(message.data);
                //     if (content.method === "startGame") {
                //         if (content.error) {
                //             setError(content.error);
                //             setTimeout(() => {
                //                 setError(undefined)
                //             }, 3000);
                //         }
                //     }
                // }
            }
        }
    }, [readyState])

    function handleStartGame() {
        ws?.send(JSON.stringify({
            method: "startGame",
            gameId: gameId
        }))

        ws?.send(JSON.stringify({
            method: "updateGameState",
            userId: getCookie("token"),
            gameId: gameId
        }))
    }

    return (
        <div className="waiting wrapper-center">
            {error && <div className="error">{error}</div>}
            <div>Ожидание начала игры</div>
            {/*Одинаковые имен*/}
            {gameState.you.userName === gameState.admin.userName &&
            <div className="wrapper-center admin">
                <div className="invite-link info">Ссылка для приглашения в игру {gameId}</div>
                <button onClick={handleStartGame}>Начать игру</button>
            </div>
            }
            <div className="players">
                <div>Подключенные игроки</div>
                <ul>
                    {gameState.players.map(({userName}) => (
                        <li key={userName} className="player">{userName}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}