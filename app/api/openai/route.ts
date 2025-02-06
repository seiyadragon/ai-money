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

    const { prompt, role } = await req.json();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: role,
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
