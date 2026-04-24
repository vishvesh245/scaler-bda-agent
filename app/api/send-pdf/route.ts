import { NextRequest } from "next/server";
import { sendWhatsAppMedia } from "@/lib/twilio";
import type { LeadProfile } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { blobUrl, lead, coveringMessage }: {
      blobUrl: string;
      lead: LeadProfile;
      coveringMessage: string;
    } = await req.json();

    if (!lead.leadWhatsApp) {
      return Response.json({ error: "Lead WhatsApp number is required" }, { status: 400 });
    }

    const msg = await sendWhatsAppMedia(lead.leadWhatsApp, blobUrl, coveringMessage);
    return Response.json({ success: true, messageSid: msg.sid });
  } catch (err) {
    console.error("send-pdf error:", err);
    return Response.json({ error: "Failed to send PDF" }, { status: 500 });
  }
}
