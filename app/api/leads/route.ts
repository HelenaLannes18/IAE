import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Método para LISTAR os contatos recebidos pelo formulário do site
export async function GET() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar contatos' }, { status: 500 });
    }
}