import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

interface Params {
    params: Promise<{ id: string }>;
}

// Método para EXCLUIR um contato
export async function DELETE(request: Request, { params }: Params) {
    try {
        if (!(await getAdminSession())) {
            return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.lead.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao excluir contato' }, { status: 500 });
    }
}