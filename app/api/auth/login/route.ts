import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Informe e-mail e senha.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Mensagem genérica de propósito: não revela se o e-mail existe ou não
        if (!user || !user.password) {
            return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
        }

        if (user.status !== 'Ativo') {
            return NextResponse.json({ error: 'Este usuário está inativo. Fale com um administrador.' }, { status: 403 });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
        }

        const token = await createSessionToken({
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 dias
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao fazer login.' }, { status: 500 });
    }
}
