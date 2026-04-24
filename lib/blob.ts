import { put } from "@vercel/blob";

export async function uploadPDF(
  filename: string,
  buffer: Buffer
): Promise<string> {
  const { url } = await put(filename, buffer, {
    access: "public",
    contentType: "application/pdf",
  });
  return url;
}
