import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { getAdminSession } from '@/lib/auth';

// Método para LISTAR os usuários (nunca retorna o hash da senha)
export async function GET() {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
                status: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
}

// Método para CRIAR um novo usuário
export async function POST(request: Request) {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const body = await request.json();
        const { name, role, status, password, imageUrl } = body;
        let { email } = body;

        if (!name) {
            return NextResponse.json({ error: 'O nome é obrigatório.' }, { status: 400 });
        }

        // "Autor" rápido criado direto na tela de artigo: sem login, sem e-mail informado.
        // Gera um e-mail técnico só pra satisfazer a unicidade do banco — nunca é usado pra login.
        if (!email) {
            email = `autor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@sem-login.iae`;
        }

        if (password && password.length < 6) {
            return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
        }

        // Verifica se já existe um usuário com esse e-mail
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'Já existe um usuário com este e-mail.' }, { status: 409 });
        }

        const hashedPassword = password ? await hashPassword(password) : null;

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                imageUrl: imageUrl || null,
                role: role || 'Autor',
                status: status || 'Ativo'
            },
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

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
    }
}