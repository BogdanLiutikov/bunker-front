import React, {useContext, useEffect, useState} from "react";
import {defaultUrl} from "../../utils/Request";
import {getCookie, setCookie} from "../../utils/Cookie";
import {useNavigate} from "react-router-dom";
import {Form} from "../Form/Form";

import {WsContext} from "../../App";

import "./Login.css"

export function Login() {

    const navigate = useNavigate();
    const [error, setError] = useState<string | undefined>(undefined)
    const ws = useContext(WsContext);

    useEffect(() => {
        if (getCookie("token"))
            navigate("/newGame");
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // @ts-ignore
        const {name: {value: name}} = e.target as HTMLFormElement;
        const response = await fetch(`${defaultUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    method: "login",
                    name: name,
                })
            }
        ).then((res) => res.json())
            .catch((rej) => {
                console.log(rej);
                setError("Проверьте соединение с сервером")
                setTimeout(() => setError(undefined), 3000)
            })

        if (response.method === "login" && response.token) {
            setCookie("token", response.token, {"max-age": "1200"})
            ws?.send(JSON.stringify({
                method: "IWasHereBefore",
                userId: getCookie("token")
            }))
            navigate('/newGame');
        }
    }

    return (
        <div className="horizontal-center">
            <div className="vertical-center">
                <div>
                    {error && <div className="error">{error}</div>}
                    <Form inputs={[{id: "name", name: "name", text: "Введите имя"}]}
                          button={{text: "Войти"}}
                          handle={handleSubmit}/>
                </div>
            </div>
        </div>
    );
}
