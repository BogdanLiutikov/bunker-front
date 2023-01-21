import React, {createContext, useRef} from 'react';
import {createHashRouter, Navigate, RouterProvider} from "react-router-dom";
import {Login} from "./components/Login/Login";
import {NewGame} from "./components/Game/NewGame";
import {Games} from "./components/Game/Games";
import {getCookie} from "./utils/Cookie";

const router = createHashRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace={true}/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "newGame",
        element: <NewGame/>,
    },
    {
        path: "games",
        element: <Games/>
    },
]);

export const WsContext = createContext<WebSocket | null>(null);

function App() {
    const ws = useRef(new WebSocket("ws://localhost:8080"));

    ws.current.addEventListener('open', () => {
        console.log("WebSocket успешно открыт")
        const userId = getCookie("token");
        if (userId)
            ws.current.send(JSON.stringify({
                method: "IWasHereBefore",
                userId: userId
            }))
    })
    ws.current.addEventListener('close', () => {
        console.log("WebSocket закрыт")
    })
    ws.current.addEventListener('error', () => {
        console.log("WebSocket ошибка")
    })

    ws.current.addEventListener('message', (message) => {
        const content = JSON.parse(message.data);
        console.log(content)
    })

    return (
        <WsContext.Provider value={ws.current}>
            <RouterProvider router={router}/>
        </WsContext.Provider>
    );
}

export default App;
