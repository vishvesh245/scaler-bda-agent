import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { bdaWhatsApp } = await req.json();

  if (!bdaWhatsApp || !/^\+\d{10,15}$/.test(bdaWhatsApp)) {
    return Response.json(
      { error: "Invalid phone number. Use E.164 format e.g. +919876543210" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("bda_number", bdaWhatsApp, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });

  return Response.json({ success: true });
}
