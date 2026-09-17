import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { getAdminSession } from '@/lib/auth';

interface Params {
    params: Promise<{ id: string }>;
}

// Método para BUSCAR um usuário específico (sem o hash da senha)
export async function GET(request: Request, { params }: Params) {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
    }
}

// Método para ATUALIZAR um usuário. A senha só é alterada se for enviada no corpo da requisição.
export async function PUT(request: Request, { params }: Params) {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { name, email, role, status, password, imageUrl } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Nome e e-mail são obrigatórios.' }, { status: 400 });
        }

        if (password && password.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
        }

        // Se o e-mail estiver sendo alterado, garante que não colide com outro usuário
        const existingUser = await prisma.user.findFirst({
            where: { email, NOT: { id: Number(id) } }
        });
        if (existingUser) {
            return NextResponse.json({ error: 'Já existe um usuário com este e-mail.' }, { status: 409 });
        }

        const data: Record<string, unknown> = { name, email, role, status, imageUrl: imageUrl || null };
        if (password) {
            data.password = await hashPassword(password);
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }
}

// Método para EXCLUIR um usuário
export async function DELETE(request: Request, { params }: Params) {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const { id } = await params;

        // Impede a exclusão se o usuário for o único autor de algum artigo
        // (se houver outros autores no artigo, a exclusão é permitida normalmente)
        const authoredPosts = await prisma.post.findMany({
            where: { authors: { some: { id: Number(id) } } },
            select: { authors: { select: { id: true } } }
        });

        if (authoredPosts.some((post) => post.authors.length === 1)) {
            return NextResponse.json(
                { error: 'Não é possível excluir: este usuário é o único autor de algum artigo. Adicione outro autor ou exclua o artigo primeiro.' },
                { status: 409 }
            );
        }

        await prisma.user.delete({ where: { id: Number(id) } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
    }
}