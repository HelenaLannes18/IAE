import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Método para LISTAR os contatos recebidos pelo formulário do site
export async function GET() {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar contatos' }, { status: 500 });
    }
}