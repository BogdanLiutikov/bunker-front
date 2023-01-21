import React from "react";

import './Form.css'

type formData = {
    inputs:
        Array<{
            id: string,
            name: string,
            text: string,
        }>,
    button: {
        text: string,
        link?: string,
    },
    handle: React.FormEventHandler<HTMLFormElement>,
}

export function Form({inputs, button = {text: "Submit", link: "."}, handle}: formData) {
    return (
        <form className="form" onSubmit={handle}>
            <ul>
                {inputs.map(({id, name, text}) => (
                    <li key={id}>
                        <label htmlFor={id}>{text}</label>
                        <input id={id} name={name} type="text"/>
                    </li>
                ))}
            </ul>
            <button type="submit">{button.text}</button>
        </form>
    );
}