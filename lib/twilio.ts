import twilio from "twilio";

let client: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!client) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
  }
  return client;
}

const FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

export async function sendWhatsAppText(to: string, body: string) {
  const c = getTwilioClient();
  return c.messages.create({ from: FROM, to: `whatsapp:${to}`, body });
}

export async function sendWhatsAppMedia(
  to: string,
  mediaUrl: string,
  body: string
) {
  const c = getTwilioClient();
  return c.messages.create({
    from: FROM,
    to: `whatsapp:${to}`,
    body,
    mediaUrl: [mediaUrl],
  });
}
