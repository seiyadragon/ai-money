export const fetchCompletion = async (prompt: string) => {
    const response = await fetch("api/openai", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = await response.json();

    return data.completion;
};
