import { NextResponse } from 'next/server';

export async function GET() {
    // Você precisa colocar seu token do Instagram no arquivo .env local:
    // INSTAGRAM_ACCESS_TOKEN=seu_token_aqui
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
        return NextResponse.json({ error: 'Token do Instagram ausente' }, { status: 500 });
    }

    try {
        // Busca os últimos posts (id, link do post e link da imagem)
        const url = `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type&access_token=${token}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Filtra para pegar apenas Imagens ou Carrosseis (ignora vídeos/reels para evitar quebrar o grid)
        const photosOnly = data.data.filter((post: any) => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM');

        return NextResponse.json({ data: photosOnly });
    } catch (error) {
        console.error('Erro na API do Instagram:', error);
        return NextResponse.json({ error: 'Erro ao conectar com o Instagram' }, { status: 500 });
    }
}