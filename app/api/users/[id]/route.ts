import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

interface Params {
    params: Promise<{ id: string }>;
}

// Método para BUSCAR um usuário específico (sem o hash da senha)
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
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
        const { id } = await params;
        const body = await request.json();
        const { name, email, role, status, password } = body;

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

        const data: Record<string, unknown> = { name, email, role, status };
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
        const { id } = await params;

        // Impede a exclusão se o usuário ainda tiver artigos vinculados
        const postsCount = await prisma.post.count({
            where: { authorId: Number(id) }
        });

        if (postsCount > 0) {
            return NextResponse.json(
                { error: 'Não é possível excluir: este usuário possui artigos vinculados. Transfira ou exclua os artigos primeiro.' },
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
