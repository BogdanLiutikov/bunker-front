import {Modal} from "../../Modal/Modal";
import {useContext, useState} from "react";

import {OptionPicker} from "../../OptionPicker";

import type {gameState} from "../Game";

import {GameLinkContext} from "../Games";
import {ErrorContext} from "../Game";
import {PlayerSpecial} from "./GameField";

type specialParams = {
    action?: string,
    params: "playerAndAttribute" | "player" | "attribute" | undefined,
    player?: string,
    attribute?: string,
}

let specialName = '';
let specialActionParams = '';

export function Specials({gameState}: { gameState: gameState }) {

    const link = useContext(GameLinkContext);
    const [special, setSpecial] = useState<PlayerSpecial>();
    const [specialParams, setSpecialParams] = useState<specialParams>({params: undefined});
    const [modal, setModal] = useState<boolean>(false);
    const [error, setError] = useContext(ErrorContext);


    //todo handleSendSpecial
    function handleSendSpecialParamsClick() {

    }

    return (
        <div className="specials">
            {special && <div className="special">
                {/*<div className="info">*/}
                {/*    {`Игрок ${special.player} использует возможность "${specialParams.action ?? "..."}"*/}
                {/*    на игрока "${specialParams.player ?? "..."}" с атрибутом "${specialParams.attribute ?? "..."}"`}*/}
                {/*</div>*/}
                <div className="pickers">
                    {
                        special.player === gameState.you.userName && modal &&
                        <Modal active={true} setActive={setModal}>
                            <form onSubmit={handleSendSpecialParamsClick}>
                                {(specialParams.params === "player" || specialParams.params === "playerAndAttribute") &&
                                <OptionPicker options={gameState.players.map(({userName, outOfGame}) =>
                                    ({
                                        name: userName,
                                        active: !outOfGame
                                    })
                                )} picker={"player"} align={"vertical"}/>
                                }
                                {(specialParams.params === "attribute" || specialParams.params === "playerAndAttribute") &&
                                gameState.you.attributes &&
                                <OptionPicker
                                    options={gameState.you.attributes.map(({name, isOpen}) => (
                                        {
                                            name: name,
                                            active: true,
                                        }
                                    ))} picker={"attribute"}/>
                                }
                                <button type="submit">Использовать способность</button>
                            </form>
                        </Modal>
                    }
                </div>
            </div>}
            <table>
                <thead>
                <tr>
                    <td>Специальная возможность</td>
                </tr>
                </thead>
                <tbody>
                {/*{gameState.specials.map(({player, special}) => (*/}
                {/*    <tr>*/}
                {/*        <td key={player + special} className={`player ${gameState.players.find(*/}
                {/*            (p: { player: string }) => (p.player === player))?.outOfGame ? "outGame" : "inGame"}`}>{player}</td>*/}
                {/*        {special.map(({description, used}) => (*/}
                {/*            <td key={player + special + description}*/}
                {/*                className={`description ${used ? "opened" : "closed"}`}>*/}
                {/*                {player === gameState.currentPlayer.player*/}
                {/*                    ? <button onClick={handleSpecialClick}*/}
                {/*                              disabled={used}*/}
                {/*                              value={description}>{description}</button>*/}
                {/*                    : <div>{description}</div>}*/}
                {/*            </td>*/}
                {/*        ))}*/}
                {/*    </tr>*/}
                {/*))}*/}
                </tbody>
            </table>
        </div>
    )
}