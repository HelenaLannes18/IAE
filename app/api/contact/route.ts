import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Método para CRIAR um novo contato/lead vindo de qualquer formulário do site
// (formulário principal de contato OU popup de boas-vindas)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, course, subject, message, source } = body;

        if (!email) {
            return NextResponse.json({ error: 'O e-mail é obrigatório.' }, { status: 400 });
        }

        // Validação simples de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
        }

        const newLead = await prisma.lead.create({
            data: {
                name: name || null,
                email,
                phone: phone || null,
                course: course || null,
                subject: subject || null,
                message: message || null,
                source: source || 'contato'
            }
        });

        return NextResponse.json(newLead, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao enviar o contato. Tente novamente.' }, { status: 500 });
    }
}