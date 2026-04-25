import { NextRequest } from "next/server";
import { AssemblyAI } from "assemblyai";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! });
    const contentType = req.headers.get("content-type") ?? "";

    let audioData: Buffer | string;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("audio") as File | null;
      if (!file) return Response.json({ error: "audio file is required" }, { status: 400 });
      const arrayBuffer = await file.arrayBuffer();
      audioData = Buffer.from(arrayBuffer);
    } else {
      const { upload_url } = await req.json();
      if (!upload_url) return Response.json({ error: "upload_url is required" }, { status: 400 });
      audioData = upload_url as string;
    }

    const result = await client.transcripts.transcribe({ audio: audioData, speech_model: "universal" });

    if (result.status === "error") {
      return Response.json({ error: `Transcription failed: ${result.error}` }, { status: 500 });
    }

    return Response.json({ transcript: result.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Transcription failed";
    console.error("transcribe error:", err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
