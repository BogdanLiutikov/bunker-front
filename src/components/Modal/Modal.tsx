import {Dispatch, SetStateAction} from "react";

import "./Modal.css"

type modal = {
    active: boolean,
    setActive: Dispatch<SetStateAction<boolean>>,
    children: JSX.Element
}

export function Modal({active, setActive, children}: modal) {

    return (
        <div className={active ? "modal active" : "modal"} onClick={event => {
            event.preventDefault();
            setActive(false)
        }}>
            <div className="modal-content" onClick={event => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}