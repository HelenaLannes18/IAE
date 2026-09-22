import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { getAdminSession } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const EXTENSION_BY_TYPE: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
};

// Recebe uma imagem enviada do computador do usuário (área administrativa) e salva em public/uploads
export async function POST(request: Request) {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
        }

        const extension = EXTENSION_BY_TYPE[file.type];
        if (!extension) {
            return NextResponse.json({ error: 'Formato de imagem não suportado. Use JPG, PNG, WEBP, GIF ou SVG.' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'A imagem deve ter no máximo 5MB.' }, { status: 400 });
        }

        const bytes = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        await writeFile(path.join(uploadsDir, fileName), bytes);

        return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao enviar imagem.' }, { status: 500 });
    }
}
