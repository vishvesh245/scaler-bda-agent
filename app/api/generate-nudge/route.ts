import { NextRequest } from "next/server";
import { getAnthropicClient, MODEL } from "@/lib/anthropic";
import { getRelevantContext } from "@/lib/knowledge";
import { NUDGE_SYSTEM, nudgeUserMessage } from "@/lib/prompts/nudge";
import type { LeadProfile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { lead }: { lead: LeadProfile } = await req.json();
    if (!lead?.name || !lead?.role) {
      return Response.json({ error: "lead.name and lead.role are required" }, { status: 400 });
    }
    const context = getRelevantContext(lead);
    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: NUDGE_SYSTEM,
      messages: [{ role: "user", content: nudgeUserMessage(lead, context) }],
    });

    const nudgeText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return Response.json({ nudgeText });
  } catch (err) {
    console.error("generate-nudge error:", err);
    return Response.json({ error: "Failed to generate nudge" }, { status: 500 });
  }
}
