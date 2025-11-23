import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.error('client_log', data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('log_endpoint_error', e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}