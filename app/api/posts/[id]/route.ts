import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

// Método para BUSCAR um artigo específico
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) },
            include: { author: true }
        });

        if (!post) {
            return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar artigo' }, { status: 500 });
    }
}

// Método para ATUALIZAR um artigo (edição ou mudança de status: publicar/rascunho)
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, category, status, imageUrl } = body;

        if (!title) {
            return NextResponse.json({ error: 'O título é obrigatório.' }, { status: 400 });
        }

        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: { title, content, category, status, imageUrl },
            include: { author: true }
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao atualizar artigo' }, { status: 500 });
    }
}

// Método para EXCLUIR um artigo
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.post.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao excluir artigo' }, { status: 500 });
    }
}