import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

// Método para EXCLUIR um contato
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.lead.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao excluir contato' }, { status: 500 });
    }
}