export const runtime = "nodejs";

export async function GET() {
  try {
    // Get a pre-signed upload URL from AssemblyAI
    // Client will upload audio directly to this URL, bypassing Vercel's 4.5MB body limit
    const res = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY!,
        "content-type": "application/octet-stream",
        "transfer-encoding": "chunked",
      },
      body: new Uint8Array(0),
    });
    const data = await res.json();
    if (!data.upload_url) {
      return Response.json({ error: "AssemblyAI did not return an upload URL" }, { status: 500 });
    }
    return Response.json({ uploadUrl: data.upload_url });
  } catch (err) {
    console.error("get-upload-url error:", err);
    return Response.json({ error: "Failed to get upload URL" }, { status: 500 });
  }
}
