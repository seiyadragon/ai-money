"use client"

import { use, useEffect, useState } from "react"
import TableEntry, { EntryData } from "./table-entry"
import { Checkbox } from "./ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"

export type TableEntries = {
    entries: EntryData[],
}

const FinancialTable = (props: TableEntries) => {

    const [allChecked, setAllChecked] = useState(false);
    const [checkedEntries, setCheckedEntries] = useState<number[]>([]);

    const onCheckAll = (checked: CheckedState) => {
        setAllChecked(checked ? true : false);
    };

    return (
        <div className="md:w-[980px] lg:w-[980px]">
            <table className="min-w-full w-full bg-white border border-gray-200">
                <thead className="h-12">
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            <Checkbox onCheckedChange={onCheckAll}/>
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Date
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Description
                        </th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.entries.map((item, index) => (
                        <TableEntry
                            key={index}
                            id={item.id}
                            type={item.type}
                            date={item.date}
                            description={item.description}
                            amount={item.amount}
                            checked={allChecked}
                            checked_action={(id, checked) => {
                                if (checked) {
                                    setCheckedEntries([...checkedEntries, id]);
                                } else {
                                    setCheckedEntries(checkedEntries.filter((entry) => entry !== id));
                                }
                            }}
                        />
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </div>
    )
}

export default FinancialTable;