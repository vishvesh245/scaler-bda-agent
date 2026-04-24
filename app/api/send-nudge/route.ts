import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { sendWhatsAppText } from "@/lib/twilio";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { nudgeText, bdaNumber: bodyNumber } = await req.json();
    const cookieStore = await cookies();
    const bdaNumber = bodyNumber || cookieStore.get("bda_number")?.value;

    if (!bdaNumber) {
      return Response.json({ error: "BDA number not set. Please go back to the home page and enter your number." }, { status: 400 });
    }

    const trimmed = nudgeText.length > 1590
      ? nudgeText.slice(0, 1590).replace(/\s+\S*$/, "") + "…"
      : nudgeText;
    const msg = await sendWhatsAppText(bdaNumber, trimmed);
    return Response.json({ success: true, messageSid: msg.sid });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("send-nudge error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
