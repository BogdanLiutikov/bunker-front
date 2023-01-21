type optionPicker = {
    options: Array<{
        name: string,
        active?: boolean
    }>;
    align?: "horizontal" | "vertical";
    picker?: string;
}

export function OptionPicker({options, align = "horizontal", picker = "optionPicker"}: optionPicker) {
    return (
        <div className="optionPicker">
            <ul className={align}>
                {options.map(({name, active}) => (
                    <li key={picker + name}>
                        <label htmlFor={picker + name}>{name}</label>
                        <input type="radio" id={picker + name} name={picker} value={name}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}