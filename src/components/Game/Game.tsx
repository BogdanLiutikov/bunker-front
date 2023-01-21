import React, {createContext, useContext, useEffect, useState} from "react";

import {GameField} from "./GameField/GameField";
import {Waiting} from "./GameField/Waiting";
import {Finished} from "./GameField/Finished";

import {GameLinkContext} from "./Games";

import "./Game.css"
import {WsContext} from "../../App";
import {getCookie} from "../../utils/Cookie";
import {readyCheck} from "../../utils/Request";


export const ErrorContext = createContext<[string | undefined,
    React.Dispatch<React.SetStateAction<string | undefined>>]>([undefined, () => {
}])

export type gameState = {
    gameId: string;
    admin: Player;
    status: "waiting" | "started" | "voting" | "finished";
    players: Array<Player>;
    currentMove: {
        player: Player,
        startMove: Date,
        endMove: Date,
        haveSeconds: number
    } | undefined
    timeToMove: number | undefined;
    freeSpace: number | undefined;
    description: {
        bunker: string | undefined;
        cataclysm: string | undefined;
    };
    you: Player;
}

export type Player = {
    userId: string;
    gameId: string;
    outOfGame: boolean;
    attributes: Array<Attribute> | undefined;
    userName: string
}

export type Attribute = {
    name: string,
    description: string[],
    level?: string,
    isOpen: boolean
}

export function Game() {

    const gameId = useContext(GameLinkContext);
    const ws = useContext(WsContext);

    const [error, setError] = useState<string | undefined>(undefined);
    const [gameState, setGameState] = useState<gameState>();
    const [readyState, setReadyState] = useState<number | undefined>();

    let tryCount = 0;

    // useEffect(() => {
    //     setReadyState(undefined);
    // }, [])


    useEffect(() => {
        if (ws !== null) {
            if (readyCheck(ws, tryCount, setReadyState) === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    method: "updateGameState",
                    userId: getCookie("token"),
                    gameId: gameId
                }))
                ws.onmessage = (message) => {
                    const content = JSON.parse(message.data)
                    // console.log(content)
                    console.log("Обновить стейт")
                    if (content.method !== "updateGameState") {
                        return;
                    }
                    setGameState(content.gameState)
                }
            }
        }
    }, [readyState])

    // useEffect(() => {
    //     console.log(gameState)
    // }, [gameState])


    return (
        <div className="game-field wrapper-center">
            {/*{error && <div className="error">{error}</div>}*/}
            <div className="wrapper-center">
                <ErrorContext.Provider value={[error, setError]}>
                    {gameState?.status === "waiting" && <Waiting gameState={gameState}/>}
                    {gameState?.status !== "waiting" &&
                    <>
                        {gameState?.status === "finished" && <Finished gameState={gameState}/>}
                        {(gameState?.status === "started" || gameState?.status === "voting")
                        && <GameField gameState={gameState}/>}
                    </>
                    }
                </ErrorContext.Provider>
            </div>
        </div>
    );
}