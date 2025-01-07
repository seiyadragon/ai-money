import OpenAI from "openai";
import { loadEnvConfig } from "@next/env";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    loadEnvConfig(process.cwd());

    const openai_org = process.env.OPENAI_ORG;
    const openai_project = process.env.OPENAI_PROJECT;
    const openai_key = process.env.OPENAI_KEY;

    const openai = new OpenAI({
        organization: openai_org,
        project: openai_project,
        apiKey: openai_key,
    });

    const { prompt } = await req.json();
    const today = new Date().toDateString();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `
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
                        And nay dates such as "yesterday" should use today's date as a reference point.
                    `
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return NextResponse.json({ completion: completion.choices[0].message.content });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
};