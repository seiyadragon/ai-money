export const fetchExpenseCompletion = async (prompt: string, today: string): Promise<string> => {
    const role = `
        Return a JSON formatted as such: 
        {
            type: "expense/income", 
            date: "yyyy-mm-dd", 
            description: "", 
            amount: ""
        } 
        by using the information provided by the user.
        Make sure the descriptions is as brief as possible.
        Don't include words like "please" or "thank you".
        Or words like "spent" or "earned".
        Keep in mind today is ${today} and any unclear dates should use today's date.
        And any dates such as "yesterday" should use today's date as a reference point.
    `;

    const response = await fetch("../api/openai", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, role: role }),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = await response.json();

    return data.completion;
};
