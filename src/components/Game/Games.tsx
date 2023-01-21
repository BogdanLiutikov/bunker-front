import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Game} from "./Game";
import {WsContext} from "../../App";
import {getCookie} from "../../utils/Cookie";

import "./Game.css"


export const GameLinkContext = createContext('');

export function Games() {

    const ws = useContext(WsContext)

    const [games, setGames] = useState<string[]>();
    const [game, setGame] = useState<string>();
    const [readyState, setReadyState] = useState<number | undefined>();
    const navigate = useNavigate();
    const token = getCookie("token");

    useEffect(() => {
        if (!getCookie("token"))
            navigate('/login')
        setReadyState(undefined)
        setGame(games?.at(0))
    }, [])

    function readyCheck() {
        if (ws?.readyState !== WebSocket.OPEN) {
            setTimeout(readyCheck, 500);
            return ws?.readyState;
        }
        setReadyState(ws.readyState)
        return ws?.readyState
    }

    useEffect(() => {
        if (ws !== null) {
            if (readyCheck() === WebSocket.OPEN) {
                ws?.send(JSON.stringify({
                    method: "myGames",
                    userId: token,
                }))

                ws.onmessage = (message) => {
                    const content = JSON.parse(message.data);
                    if (content.method !== "myGames")
                        return;
                    const games: string[] = content.games.map(({gameId}: { gameId: string }) => gameId)
                    setGames(games)
                    setGame(games?.at(0))
                }
            }
        }
    }, [readyState])

    //todo Выйти из игры
    function handleLeaveGame() {

        navigate("/newGame")
    }

    return (
        <>
            <div className="games">
                <div className="outer">
                    <nav className="games-nav wrapper-center">
                        <button onClick={() => navigate('/newGame')}>Добавить игру</button>
                        <select value={game} onChange={(e) => setGame(e.target.value)}>
                            {games?.map((link) =>
                                <option key={link} value={link}>{link.slice(0, 4)}</option>)}
                        </select>
                        <button onClick={handleLeaveGame}>Покинуть игру</button>
                    </nav>
                </div>
                {game &&
                <GameLinkContext.Provider value={game}>
                    <Game/>
                </GameLinkContext.Provider>}
            </div>
        </>
    );
}