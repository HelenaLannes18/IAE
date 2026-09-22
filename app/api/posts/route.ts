import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { uniqueSlug } from '@/lib/slugify';

// Método para LISTAR os artigos (usado no Dashboard e na Tabela)
export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: { authors: { select: { id: true, name: true, imageUrl: true, bio: true } } }, // Só os dados públicos do autor (sem senha)
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
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, category, status, authorIds, imageUrl } = body;

        if (!title || !category) {
            return NextResponse.json({ error: 'Título e categoria são obrigatórios.' }, { status: 400 });
        }

        if (!Array.isArray(authorIds) || authorIds.length === 0) {
            return NextResponse.json({ error: 'Selecione pelo menos um autor.' }, { status: 400 });
        }

        // Gera um slug único para a URL pública do artigo (ex: /blog/meu-artigo) a partir do título
        const existingSlugs = new Set(
            (await prisma.post.findMany({ select: { slug: true } })).map((p) => p.slug).filter((s): s is string => !!s)
        );
        const slug = uniqueSlug(title, existingSlugs);

        const newPost = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                category,
                status,
                imageUrl: imageUrl || null, // Se não houver imagem, define como null
                authors: { connect: authorIds.map((id: number) => ({ id: Number(id) })) }
            },
            include: { authors: { select: { id: true, name: true, imageUrl: true, bio: true } } }
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 });
    }
}