import React from "react";

export const defaultUrl = "http://localhost:8080";

export function readyCheck(ws: WebSocket, tryCount: number, setReadyState: React.Dispatch<React.SetStateAction<number | undefined>>): number {
    if (ws?.readyState !== WebSocket.OPEN && tryCount < 10) {
        tryCount++;
        setTimeout(readyCheck, 500);
        return ws?.readyState;
    }
    setReadyState(ws?.readyState)
    return ws?.readyState
}