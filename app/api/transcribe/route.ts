import { NextRequest } from "next/server";
import { uploadAudio, submitTranscription, pollTranscription } from "@/lib/assemblyai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    let uploadUrl: string;

    if (contentType.includes("multipart/form-data")) {
      // Audio file uploaded directly — upload to AssemblyAI then transcribe
      const form = await req.formData();
      const file = form.get("audio") as File | null;
      if (!file) return Response.json({ error: "audio file is required" }, { status: 400 });
      const arrayBuffer = await file.arrayBuffer();
      uploadUrl = await uploadAudio(Buffer.from(arrayBuffer), file.type || "audio/mpeg");
    } else {
      // Legacy: upload_url already obtained (kept for backwards compat)
      const { upload_url } = await req.json();
      if (!upload_url) return Response.json({ error: "upload_url is required" }, { status: 400 });
      uploadUrl = upload_url;
    }

    const transcriptId = await submitTranscription(uploadUrl);
    const transcript = await pollTranscription(transcriptId);

    return Response.json({ transcript });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Transcription failed";
    console.error("transcribe error:", err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
