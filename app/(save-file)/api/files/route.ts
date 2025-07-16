import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const files = await fs.readdir(uploadDir).catch(() => []);
        return NextResponse.json({ files });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ files: [] }, { status: 500 });
    }
}