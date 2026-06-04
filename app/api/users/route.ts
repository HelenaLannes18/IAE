import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lista todos os usuários
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
}

// Cria um novo usuário
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, role, status } = body;

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                role: role || "Autor",
                status: status || "Ativo"
            }
        });
        
        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        console.error(error);
        // O Prisma avisa se tentarmos criar um email que já existe (erro P2002)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Este e-mail já está em uso.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
    }
}