import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function POST(request: Request) {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Chuyển Request body thành Node.js readable stream
        const body = await request.arrayBuffer();
        const stream = Readable.from(Buffer.from(body));

        // Tạo mock IncomingMessage object
        const mockReq = Object.assign(stream, {
            headers: Object.fromEntries(request.headers.entries()),
            method: request.method,
            url: request.url,
        });

        const form = new IncomingForm({
            uploadDir,
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
        });

        return new Promise((resolve, reject) => {
            form.parse(mockReq as any, (err, fields, files) => {
                if (err) {
                    console.error('Parse error:', err);
                    resolve(NextResponse.json({ message: 'Error parsing file' }, { status: 500 }));
                    return;
                }

                const file = files.file?.[0];
                if (!file) {
                    resolve(NextResponse.json({ message: 'No file uploaded' }, { status: 400 }));
                    return;
                }

                resolve(NextResponse.json({ 
                    message: 'File uploaded successfully',
                    fileName: file.originalFilename
                }));
            });
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}