import { NextRequest } from "next/server";
import { getAnthropicClient, MODEL } from "@/lib/anthropic";
import { getContextByKeywords } from "@/lib/knowledge";
import { IN_CALL_SYSTEM, inCallUserMessage } from "@/lib/prompts/in-call";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    const context = getContextByKeywords(question);
    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 200,
      system: IN_CALL_SYSTEM,
      messages: [{ role: "user", content: inCallUserMessage(question, context) }],
    });

    const answer = message.content[0].type === "text" ? message.content[0].text : "";
    return Response.json({ answer });
  } catch (err) {
    console.error("in-call-assist error:", err);
    return Response.json({ error: "Failed to get answer" }, { status: 500 });
  }
}
