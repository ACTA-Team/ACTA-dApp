import { NextResponse } from 'next/server';

const store = new Map<string, unknown>();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = (globalThis.crypto && 'randomUUID' in globalThis.crypto
      ? (globalThis.crypto as unknown as { randomUUID: () => string }).randomUUID()
      : Math.random().toString(36).slice(2)) as string;
    store.set(id, data);
    return NextResponse.json({ id });
  } catch (e) {
    console.error('share_store_error', e);
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || '';
    if (!key || !store.has(key)) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(store.get(key));
  } catch (e) {
    console.error('share_get_error', e);
    return NextResponse.json(null, { status: 400 });
  }
}