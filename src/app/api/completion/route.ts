import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    console.log("SERVER PROMPT:", prompt);

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `
           You are an inline autocomplete engine inside a rich-text editor.

            Your job is to CONTINUE the user's last sentence naturally.

            Rules:
            - Output ONLY plain text
            - Do NOT add titles, headings, or markdown
            - Do NOT repeat the user's text
            - Do NOT start new paragraphs
            - Do NOT use bullet points or formatting
            - Continue from exactly where the text ends
            - Keep the completion short (3-4 sentences max)
            - Match the existing tone and tense
          `.trim(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("Error in /api/completion:", error);
    return new Response("OpenAI request failed", { status: 500 });
  }
}
