"use client"

import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox";

export type EntryData = {
    id: number,
    type: string,
    date: string,
    description: string,
    amount: number,
    deleted: boolean,
}

export type EntryProps = {
    entry: EntryData,
    checked: boolean,
    checked_action: (id: number, checked: boolean) => void,
}

const TableEntry = (props: EntryProps) => {
    const [checked, setChecked] = useState(props.checked);

    const onItemCheck = (checkedState: CheckedState) => {
        setChecked(checkedState ? true : false);
        props.checked_action(props.entry.id, checkedState ? true : false);
    };

    useEffect(() => {
        setChecked(props.checked);
    }, [props.checked]);

    useEffect(() => {
        if (checked) {
            props.checked_action(props.entry.id, true);
        } else {
            props.checked_action(props.entry.id, false);
        }
    }, [checked]);

    return (
        <tr className={`${props.entry.type == "expense" ? "bg-red-400" : "bg-green-400"}`}>
            <td className="py-2 px-4 border-b border-gray-200 w-1/12">
                <Checkbox onCheckedChange={onItemCheck} checked={checked}/>
            </td>
            <td className="py-2 px-4 border-b border-gray-200 w-1/6">
                {props.entry.date}
            </td>
            <td className="py-2 px-4 border-b border-gray-200">
                {props.entry.description}
            </td>
            {props.entry.type == "income" && (
                <td className="py-2 px-4 border-b border-gray-200 w-1/6">
                    + ${props.entry.amount}
                </td>
            )}
            {props.entry.type == "expense" && (
                <td className="py-2 px-4 border-b border-gray-200 w-1/6">
                    - ${props.entry.amount}
                </td>
            )}
        </tr>
    )
}

export default TableEntry;