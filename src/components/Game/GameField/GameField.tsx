import {useContext} from "react";

import {Voting} from "./Voting";
import {Specials} from "./Specials";
import {Attributes} from "./Attributes";

import {ErrorContext} from "../Game";
import type {gameState} from "../Game";

export type PlayerSpecial = {
    player: string,
    special: Array<Special>,
}

export type Special = {
    description: string,
    used: boolean,
}

export function GameField({gameState}: { gameState: gameState }) {

    const [error, setError] = useContext(ErrorContext);

    return (
        <div className="game wrapper-center">
            <div className="game-description wrapper-center">
                <div className="cataclysm">Катаклизм</div>
                <div className="cataclysm-desc">
                    {gameState.description.cataclysm}
                </div>
                <div className="bunker">Бункер</div>
                <div className="bunker-desc">
                    <ul>
                        <li><span>Описание</span> {gameState.description.bunker}</li>
                        {/*<li><span>Размер бункера</span> {gameState.description.bunker} кв. метров</li>*/}
                        {/*<li>*/}
                        {/*    <span>Время прибывания в бункере</span> {Math.floor(gameState.description.takesTime / 12)} месяцев*/}
                        {/*</li>*/}
                        {/*<li><span>Количество еды в бункере</span> {gameState.description.food} месяцев на 10 человек*/}
                        {/*</li>*/}
                    </ul>
                </div>
            </div>
            {/*//todo information*/}
            {/*{gameState.info && <div className="info">{gameState.info}</div>}*/}
            {/*{gameState.status === "started" &&*/}
            {/*<div className="current-move">Ходит <span*/}
            {/*    className="player">{gameState.currentMove?.player.userName}</span> еще {gameState.currentMove?.haveSeconds} секунд*/}
            {/*</div>*/}
            {/*}*/}
            {error && <div className="error">{error}</div>}
            {gameState?.status === "voting"
            && <Voting gameState={gameState}/>
            }
            <Attributes gameState={gameState}/>
            {/*<Specials gameState={gameState}/>*/}
        </div>
    )
}