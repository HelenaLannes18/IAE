import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

// Método para BUSCAR um item específico da agenda
export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const item = await prisma.agenda.findUnique({
            where: { id: Number(id) }
        });

        if (!item) {
            return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar item da agenda' }, { status: 500 });
    }
}

// Método para ATUALIZAR um item da agenda
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { category, title, image, gridClass, speakers, link, order, status } = body;

        if (!category || !title || !image || !speakers) {
            return NextResponse.json({ error: 'Categoria, título, imagem e palestrantes são obrigatórios.' }, { status: 400 });
        }

        const updatedItem = await prisma.agenda.update({
            where: { id: Number(id) },
            data: {
                category,
                title,
                image,
                gridClass,
                speakers,
                link: link || null,
                order: typeof order === 'number' ? order : 0,
                status
            }
        });

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao atualizar item da agenda' }, { status: 500 });
    }
}

// Método para EXCLUIR um item da agenda
export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.agenda.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao excluir item da agenda' }, { status: 500 });
    }
}