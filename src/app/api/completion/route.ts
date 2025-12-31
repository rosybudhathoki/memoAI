import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    console.log("SERVER PROMPT:", prompt);

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `
            You are a helpful AI embedded in a notion test editor app that is used to autocomplete sentences.
            The traits of the AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is well-behaved, friendly, kind, inspiring, and eager to provide vivid and thoughtful responses.
          `,
        },
        {
          role: "user",
          content: `I'm writing a piece of text in a notion text editor appRouterContext. Help me complete my train of thoughts here: ##${prompt}## keep the tone of the text consistent with the rest of the text. And keep the response short and sweet.`,
        },
      ],
    });

    const full = await result.text;

    console.log("SERVER FULL COMPLETION:", full);

    return new Response(
      JSON.stringify({ completion: full }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in /api/completion:", error);
    return new Response("OpenAI request failed", { status: 500 });
  }
}
