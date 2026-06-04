import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Método para LISTAR os artigos (usado no Dashboard e na Tabela)
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: { author: true }, // Traz os dados do usuário que criou o artigo
            orderBy: { createdAt: 'desc' }
        });
        
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar artigos' }, { status: 500 });
    }
}

// Método para CRIAR um novo artigo
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, category, status, authorId } = body;

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                category,
                status,
                authorId: Number(authorId) // Garante que o ID do autor é um número
            }
        });
        
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 });
    }
}