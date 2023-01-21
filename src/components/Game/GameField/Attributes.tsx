import type {gameState} from "../Game";
import React, {useContext} from "react";
import {WsContext} from "../../../App";
import {getCookie, setCookie} from "../../../utils/Cookie";
import {GameLinkContext} from "../Games";


export function Attributes({gameState}: { gameState: gameState }) {

    const ws = useContext(WsContext)
    const gameId = useContext(GameLinkContext)


    function handleAttributeClick(e: React.MouseEvent<HTMLButtonElement>) {
        const token = getCookie("token");
        ws?.send(JSON.stringify({
            method: "openAttribute",
            gameId: gameId,
            userId: token,
            attribute: (e.target as HTMLButtonElement).value
        }))

        ws?.send(JSON.stringify({
            method: "updateGameState",
            gameId: gameId,
            userId: token
        }))
        setCookie("token", token as string, {"max-age": "1200"})
    }

    return (
        <div className="attributes">
            <table>
                <thead>
                <tr>
                    <td>Игрок</td>
                    {gameState.you.attributes?.map(({name}) => (
                        <td key={name}>{name}</td>
                    ))}
                </tr>
                </thead>
                <tbody>
                {gameState.players.map(({userName, outOfGame, attributes}) => (
                    <tr key={userName}>
                        <td className={`player ${outOfGame ? "outGame" : "inGame"}`}>{userName}</td>
                        {attributes?.map(({name, description, isOpen}) => (
                            <td key={name}
                                className={`description ${isOpen ? "opened" : "closed"}`}>
                                {userName === gameState.you.userName
                                    ? <button onClick={handleAttributeClick}
                                              disabled={isOpen}
                                              value={name}>{description}</button>
                                    : <div>{isOpen ? description : "Не открыт"}</div>}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}