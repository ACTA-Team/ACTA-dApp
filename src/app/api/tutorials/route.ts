import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type Tutorial = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  videoPath: string;
};

function formatTitle(name: string): string {
  const base = name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  return base
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'videos', 'tutorials');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    const mp4s = files.filter((f) => f.toLowerCase().endsWith('.mp4'));
    const items: Tutorial[] = mp4s.map((file) => {
      const id = path.parse(file).name;
      const title = formatTitle(id);
      return {
        id,
        title,
        description: 'Tutorial',
        category: 'General',
        duration: '—',
        videoPath: `/videos/tutorials/${file}`,
      };
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}