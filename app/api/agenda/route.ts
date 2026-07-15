import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Método para LISTAR os itens da agenda (usado no admin e no site público)
export async function GET() {
    try {
        const items = await prisma.agenda.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar agenda' }, { status: 500 });
    }
}

// Método para CRIAR um novo item da agenda
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { category, title, image, gridClass, speakers, link, order, status } = body;

        if (!category || !title || !image || !speakers) {
            return NextResponse.json({ error: 'Categoria, título, imagem e palestrantes são obrigatórios.' }, { status: 400 });
        }

        const newItem = await prisma.agenda.create({
            data: {
                category,
                title,
                image,
                gridClass: gridClass || 'md:col-span-1 md:row-span-1 min-h-[300px]',
                speakers,
                link: link || null,
                order: typeof order === 'number' ? order : 0,
                status: status || 'Ativo'
            }
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao criar item da agenda' }, { status: 500 });
    }
}