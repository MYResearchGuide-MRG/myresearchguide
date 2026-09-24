// app/api/send/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      'RESEND_API_KEY environment variable is not set. ' +
      'Get your API key at https://resend.com/api-keys'
    );
  }
  return new Resend(key);
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();
    const resend = getResend();

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['ernesttyx@gmail.com'], // Must be your Resend login email
      subject: `Contact: ${name}`,
      text: `From: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend Error Details:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Fetch Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}