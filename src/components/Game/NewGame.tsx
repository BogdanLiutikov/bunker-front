import React, {useContext, useEffect, useState} from "react";
import {getCookie} from "../../utils/Cookie";
import {useNavigate} from "react-router-dom";

import {Form} from "../Form/Form";

import {defaultUrl} from "../../utils/Request";
import {WsContext} from "../../App";
import {GameLinkContext} from "./Games";


export function NewGame() {

    const navigate = useNavigate();

    const ws = useContext(WsContext);
    const gameId = useContext(GameLinkContext);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!getCookie("token"))
            navigate("/login")
    }, [])

    async function joinGame(gameId: string) {

        const token = getCookie("token");
        const response = await fetch(`${defaultUrl}/joinGame`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                method: "joinGame",
                gameId: gameId
            })
        }).then((res) => res.json())

        if (response.method === "joinGame") {
            if (response.error) {
                setError(response.error);
                console.log(response.error);
            } else {
                ws?.send(JSON.stringify({
                    method: "joinGame",
                    gameId: gameId
                }))
                navigate("/games");
            }
        }
        return response;
    }

    async function handleSubmitCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const token = getCookie("token");

        const {freeSpace: {value: freeSpace}, timeToMove: {value: timeToMove}} = e.target as HTMLFormElement;

        const response = await fetch(`${defaultUrl}/newGame`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                method: "createGame",
                freeSpace: freeSpace,
                timeToMove: timeToMove
            })
        }).then((res) => res.json())
            .catch((rej) => console.log(rej))


        if (response.method === "createGame") {
            if (response.gameId) {
                // Я захожу в игру при создании на сервере
                // await joinGame(response.gameId);
                navigate("/games")
            }
        }
    }

    async function handleSubmitEnter(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const {gameId: {value: gameId}} = e.currentTarget;
        await joinGame(gameId);
    }

    return (
        <div className="wrapper-center">
            <div className="vertical-center">
                <div className="wrapper-center">
                    {error &&
                    <div className="error">
                        {error}
                    </div>}
                    <div className="choose-game">
                        <ul>
                            <li className="wrapper-center">
                                <span>Создать игру</span>
                                <Form inputs={[{
                                    id: "freeSpace",
                                    name: "freeSpace",
                                    text: "Мест в бункере"
                                }, {
                                    id: "timeToMove",
                                    name: "timeToMove",
                                    text: "Количество секунд на ход"
                                }]}
                                      button={{text: "Создать"}}
                                      handle={handleSubmitCreate}/>
                            </li>
                            <li className="wrapper-center">
                                <span>Войти в игру</span>
                                <Form inputs={[{id: "join-game-link", name: "gameId", text: "Ссылка на комнату"}]}
                                      button={{text: "Войти"}}
                                      handle={handleSubmitEnter}/>
                            </li>
                        </ul>
                    </div>
                    <button onClick={() => navigate('/games')}>К моим играм</button>
                </div>
            </div>
        </div>
    );
}