"use client"

import { Key, use, useEffect, useState } from "react"
import TableEntry, { EntryData } from "./table-entry"
import { Checkbox } from "./ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"
import { createClient } from "@/utils/supabase/client"
import { Input } from "./ui/input"
import { fetchCompletion } from "@/app/dashboard/actions"

export type TableEntries = {
    entries: EntryData[],
    deletedEntries: EntryData[],
}

export type DateRange = {
    start: string,
    end: string
}

const FinancialTable = (props: TableEntries) => {

    const dtf = (date: Date) => {
        const yeah = date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const [month, day, year] = yeah.split("/");

        return `${year}-${month}-${day}`;
    }

    const dateBefore = (date1: string, date2: string): boolean => {
        const [year1, month1, day1] = date1.split("-");
        const [year2, month2, day2] = date2.split("-");

        if (year1 < year2) {
            return true;
        } else if (year1 == year2) {
            if (month1 < month2) {
                return true;
            } else if (month1 == month2) {
                if (day1 <= day2) {
                    return true;
                }
            }
        }

        return false;
    }

    const dateAfter = (date1: string, date2: string): boolean => {
        const [year1, month1, day1] = date1.split("-");
        const [year2, month2, day2] = date2.split("-");

        if (year1 > year2) {
            return true;
        } else if (year1 == year2) {
            if (month1 > month2) {
                return true;
            } else if (month1 == month2) {
                if (day1 >= day2) {
                    return true;
                }
            }
        }

        return false;
    }

    const dateBetween = (date: string, start: string, end: string): boolean => {
        return dateAfter(date, start) && dateBefore(date, end);
    }

    const today = new Date();

    const [allChecked, setAllChecked] = useState(false);
    const [checkedEntries, setCheckedEntries] = useState<number[]>([]);
    const [entries, setEntries] = useState(props.entries);
    const [deletedEntries, setDeletedEntries] = useState(props.deletedEntries);
    const [showDeleted, setShowDeleted] = useState(false);
    const [hiddenEntries, setHiddenEntries] = useState<EntryData[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({start: dtf(today), end: dtf(today)});
    const [textInputValue, setTextInputValue] = useState("");

    useEffect(() => {
        setAllChecked(false);
        setCheckedEntries([]);
        selectDateRange({start: dtf(today), end: dtf(today)});
    }, [showDeleted]);

    useEffect(() => {
        setTotal(calculateTotal());
    }, [entries, deletedEntries, showDeleted]);

    const onCheckAll = (checked: CheckedState) => {
        setAllChecked(checked ? true : false);

        if (!showDeleted) {
            if (checked) {
                let newCheckedEntries = entries.map((entry) => entry.id);
                setCheckedEntries(newCheckedEntries);
            } else {
                setCheckedEntries([]);
            }
        } else {
            if (checked) {
                let newCheckedEntries = deletedEntries.map((entry) => entry.id);
                setCheckedEntries(newCheckedEntries);
            } else {
                setCheckedEntries([]);
            }
        }
    };

    const deleteSelected = async () => {
        const supabase = await createClient();
    
        const {
            data: { user },
        } = await supabase.auth.getUser();
    
        const updatedDeletedEntries = [...deletedEntries];
        const updatedEntries = [...entries];
    
        for (let i = 0; i < checkedEntries.length; i++) {
            await supabase.from("UserData")
                .update({ deleted: true })
                .eq("id", checkedEntries[i])
                .eq("user_id", user?.id);
    
            // Remove the entry from the active entries and add it to the deleted entries
            const entryToDelete = updatedEntries.find((entry) => entry.id === checkedEntries[i]);
            if (entryToDelete) {
                updatedDeletedEntries.push(entryToDelete);
                const index = updatedEntries.indexOf(entryToDelete);
                if (index > -1) {
                    updatedEntries.splice(index, 1);
                }
            }
        }
    
        setDeletedEntries(updatedDeletedEntries);
        setEntries(updatedEntries);
        setTotal(calculateTotal());
    }

    const deleteSelectedPermanently = async () => {
        const supabase = await createClient();
    
        const {
            data: { user },
        } = await supabase.auth.getUser();
    
        for (let i = 0; i < checkedEntries.length; i++) {
            await supabase.from("UserData")
                .delete()
                .eq("id", checkedEntries[i])
                .eq("user_id", user?.id);
        }
    
        const updatedDeletedEntries = [...deletedEntries];
    
        for (let i = 0; i < checkedEntries.length; i++) {
            const entryToDelete = updatedDeletedEntries.find((entry) => entry.id === checkedEntries[i]);
            if (entryToDelete) {
                const index = updatedDeletedEntries.indexOf(entryToDelete);
                if (index > -1) {
                    updatedDeletedEntries.splice(index, 1);
                }
            }
        }
    
        setDeletedEntries(updatedDeletedEntries);
        setTotal(calculateTotal());
    }

    const restoreSelected = async () => {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();
    
        const updatedEntries = [...entries];
        const updatedDeletedEntries = [...deletedEntries];
    
        for (let i = 0; i < checkedEntries.length; i++) {
            await supabase.from("UserData")
                .update({ deleted: false })
                .eq("id", checkedEntries[i])
                .eq("user_id", user?.id);
    
            // Restore the entry from the deleted entries and add it to the active entries
            const entryToRestore = updatedDeletedEntries.find((entry) => entry.id === checkedEntries[i]);
            if (entryToRestore) {
                updatedEntries.push(entryToRestore);
                const index = updatedDeletedEntries.indexOf(entryToRestore);
                if (index > -1) {
                    updatedDeletedEntries.splice(index, 1);
                }
            }
        }
    
        setEntries(updatedEntries);
        setDeletedEntries(updatedDeletedEntries);
        setTotal(calculateTotal());
    }

    const calculateTotal = () => {
        let total = 0;
        let negative = false;

        if (!showDeleted) {
            for (let i = 0; i < entries.length; i++) {
                if (!entries[i].deleted) {
                    if (entries[i].type === "income") {
                        total += entries[i].amount;
                    } else {
                        total -= entries[i].amount;
                    }
                }
            }
        } else {
            for (let i = 0; i < deletedEntries.length; i++) {
                if (deletedEntries[i].deleted) {
                    if (deletedEntries[i].type === "income") {
                        total += deletedEntries[i].amount;
                    } else {
                        total -= deletedEntries[i].amount;
                    }
                }
            }
        }

        if (total < 0) {
            negative = true;
            total = Math.abs(total);
        }

        return {total: total, negative: negative};
    }

    const [total, setTotal] = useState(calculateTotal());

    const submitMessage = async (prompt: string) => {
        const supabase = await createClient();

        const completion = await fetchCompletion(prompt);
        const completionData = JSON.parse(completion);
        
        const {
            data: { user },
        } = await supabase.auth.getUser();

        await supabase.from("UserData")
            .insert([
                {
                    type: completionData.type,
                    date: completionData.date,
                    description: completionData.description,
                    amount: completionData.amount,
                    user_id: user?.id,
                    deleted: false,
                }
            ]);
        
        const updatedEntries = [...entries];
        
        // Add the new entry to the active entries only if it falls within the date range
        if (dateBetween(completionData.date, dateRange.start, dateRange.end)) {
            updatedEntries.push({
                id: updatedEntries.length + 1,
                type: completionData.type,
                date: completionData.date,
                description: completionData.description,
                amount: completionData.amount,
                deleted: false
            });
        } else {
            setHiddenEntries([
                ...hiddenEntries,
                {
                    id: updatedEntries.length + 1,
                    type: completionData.type,
                    date: completionData.date,
                    description: completionData.description,
                    amount: completionData.amount,
                    deleted: false
                }
            ]);
        }

        setEntries(updatedEntries);
        setTotal(calculateTotal());
        setTextInputValue("");
    }

    const submitMessageKeyEvent = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const prompt = (event.target as HTMLInputElement).value;
            submitMessage(prompt);
        }
    }

    const submitMessageButtonEvent = async () => {
        submitMessage(textInputValue);
    }

    const onTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextInputValue(event.target.value);
    }

    const selectDateRange = async (dateRange: DateRange) => {
        setDateRange(dateRange);

        const entriesToHide: EntryData[] = [];
        const entriesToShow: EntryData[] = [];
    
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
        // Combine current entries and hidden entries for filtering
        const allEntries = [...entries, ...hiddenEntries];
    
        if (!startDate && !endDate) {
            // If both startDate and endDate are null, show all entries
            setEntries(allEntries);
            setHiddenEntries([]);
            return;
        }
    
        for (let i = 0; i < allEntries.length; i++) {
            const entryDate = new Date(allEntries[i].date);
    
            if (
                (startDate && endDate && entryDate >= startDate && entryDate <= endDate) ||
                (startDate && !endDate && entryDate >= startDate) ||
                (!startDate && endDate && entryDate <= endDate)
            ) {
                entriesToShow.push(allEntries[i]);
            } else {
                entriesToHide.push(allEntries[i]);
            }
        }
    
        setHiddenEntries(entriesToHide);
        setEntries(entriesToShow);
    };

    const selectDateRangeEvent = async (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if (type === "today") {
            const today = dtf(new Date());
            selectDateRange({start: today, end: today});
        } else if (type === "week") {
            const today = new Date();
            const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            selectDateRange({start: dtf(lastWeek), end: dtf(today)});
        } else if (type === "month") {
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            selectDateRange({start: dtf(lastMonth), end: dtf(today)});
        } else if (type === "year") {
            const today = new Date();
            const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            selectDateRange({start: dtf(lastYear), end: dtf(today)});
        } else if (type === "all") {
            selectDateRange({start: "", end: ""});
        }
    }

    return (
        <div className="md:w-[980px] lg:w-[980px]">
            <table className="min-w-full w-full border">
                <thead className="h-16 border-b">
                    <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold">
                            <Checkbox onCheckedChange={onCheckAll} checked={allChecked}/>
                        </th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">
                            Date
                        </th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">
                            Description
                        </th>
                        <th className="py-2 px-4 text-left text-sm font-semibold">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(showDeleted ? deletedEntries : entries).map((item, index) => (
                        <TableEntry
                            key={index}
                            entry={
                                {
                                    id: item.id,
                                    type: item.type,
                                    date: item.date,
                                    description: item.description,
                                    amount: item.amount,
                                    deleted: item.deleted,
                                }
                            }
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
            {!showDeleted && (
                <div>
                    <div className="flex justify-between mt-4 align-middle">
                        <div className="flex">
                            <span className="text-sm font-semibold">Start Date: </span>
                            <Input type="date" placeholder="Start Date" className="w-1/2" value={dateRange.start} onChange={(event) => selectDateRange({start: event.target.value, end: dateRange.end})}/>
                            <span className="text-sm font-semibold ml-4">End Date: </span>
                            <Input type="date" placeholder="End Date" className="w-1/2" value={dateRange.end} onChange={(event) => selectDateRange({start: dateRange.start, end: event.target.value})}/>
                        </div>
                        <div className="flex">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={deleteSelected}>
                                Delete
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => {
                                setShowDeleted(true)
                                setTotal(calculateTotal())
                            }}>
                                Show Deleted
                            </button>
                            <div className={`${total.negative ? "bg-red-400" : "bg-green-400"} text-white font-bold py-2 px-4 rounded ml-4`}>
                                <span>Total: {total.negative ? "-" : "+"} ${total.total}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start w-full mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={(event) => selectDateRangeEvent(event, "today")}>
                            Today
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={(event) => selectDateRangeEvent(event, "week")}>
                            Week
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={(event) => selectDateRangeEvent(event, "month")}>
                            Month
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={(event) => selectDateRangeEvent(event, "year")}>
                            Year
                        </button>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={(event) => selectDateRangeEvent(event, "all")}>
                            All
                        </button>
                    </div>
                    <div className="flex mt-4">
                        <Input type="text" placeholder="Type your income/expense here..." className="w-full" value={textInputValue} onChange={(event) => onTextInputChange(event)} onKeyDown={(event) => submitMessageKeyEvent(event)}/>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={submitMessageButtonEvent}>
                            Submit
                        </button>
                    </div>
                </div>
            )}  
            {showDeleted && (
                <div className="flex justify-end mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={deleteSelectedPermanently}>
                        Delete Permanently
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={restoreSelected}>
                        Restore
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => {
                        setShowDeleted(false)
                        setTotal(calculateTotal())
                    }}>
                        Show Active
                    </button>
                    <div className={`${total.negative ? "bg-red-400" : "bg-green-400"} text-white font-bold py-2 px-4 rounded ml-4`}>
                        <span>Total: {total.negative ? "-" : "+"} ${total.total}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FinancialTable;