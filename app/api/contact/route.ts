import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Método para CRIAR um novo contato/lead vindo do formulário do site
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, course } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Nome e e-mail são obrigatórios.' }, { status: 400 });
        }

        // Validação simples de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
        }

        const newLead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || null,
                course: course || null
            }
        });

        return NextResponse.json(newLead, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao enviar o contato. Tente novamente.' }, { status: 500 });
    }
}