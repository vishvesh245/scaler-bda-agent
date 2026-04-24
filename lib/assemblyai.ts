const BASE = "https://api.assemblyai.com";

export async function uploadAudio(audioBuffer: Buffer, contentType: string): Promise<string> {
  const res = await fetch(`${BASE}/v2/upload`, {
    method: "POST",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      "content-type": contentType || "audio/mpeg",
    },
    body: audioBuffer as unknown as BodyInit,
  });
  const data = await res.json();
  if (!data.upload_url) throw new Error("AssemblyAI upload failed");
  return data.upload_url as string;
}

export async function submitTranscription(uploadUrl: string): Promise<string> {
  const res = await fetch(`${BASE}/v2/transcript`, {
    method: "POST",
    headers: {
      authorization: process.env.ASSEMBLYAI_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({ audio_url: uploadUrl }),
  });
  const data = await res.json();
  return data.id as string;
}

export async function pollTranscription(
  id: string,
  timeoutMs = 55000
): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${BASE}/v2/transcript/${id}`, {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY! },
    });
    const data = await res.json();
    if (data.status === "completed") return data.text as string;
    if (data.status === "error") throw new Error(`AssemblyAI error: ${data.error}`);
  }
  throw new Error("Transcription timed out — audio may be too long (max ~5 min)");
}
