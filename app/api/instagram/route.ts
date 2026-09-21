import { NextResponse } from 'next/server';

const GRAPH_API_VERSION = 'v25.0';

export async function GET() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const businessId = process.env.INSTAGRAM_BUSINESS_ID;

    if (!token || !businessId) {
        return NextResponse.json({ error: 'Token ou ID da conta do Instagram ausente' }, { status: 500 });
    }

    try {
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${businessId}/media?fields=id,media_url,permalink,media_type,username,caption&access_token=${token}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const photosOnly = data.data.filter((post: any) => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM');

        return NextResponse.json({ data: photosOnly });
    } catch (error) {
        console.error('Erro na API do Instagram:', error);
        return NextResponse.json({ error: 'Erro ao conectar com o Instagram' }, { status: 500 });
    }
}
