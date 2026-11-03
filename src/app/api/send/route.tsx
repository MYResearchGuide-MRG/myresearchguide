// app/api/send/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY environment variable is not set.');
  }
  return new Resend(key);
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing name, email, or message.' },
        { status: 400 }
      );
    }

    const { data, error } = await getResend().emails.send({
      from: 'MYResearchGuide <onboarding@resend.dev>',
      to: ['myresearchguide.org@gmail.com'], // MRG inbox = Resend account owner (required while on the sandbox sender)
      replyTo: email,                         // reply in Gmail goes straight to the sender
      subject: `Contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message ?? 'Email provider rejected the request.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
