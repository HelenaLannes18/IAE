import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './BlogPostClient';

const SITE_URL = "https://www.iae.edu.br";
const SITE_NAME = "IAE - Instituto de Advocacia Empresarial";
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

type PageProps = {
    params: Promise<{ id: string }>;
};

function stripHtml(html: string | null | undefined, maxLength = 160) {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function resolveImageUrl(imageUrl: string | null | undefined) {
    if (!imageUrl) return DEFAULT_OG_IMAGE;
    return imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const postId = Number(id);

    if (!Number.isInteger(postId)) {
        return { title: `Artigo não encontrado | ${SITE_NAME}` };
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { authors: { select: { name: true } } }
    });

    if (!post) {
        return { title: `Artigo não encontrado | ${SITE_NAME}` };
    }

    const authorNames = post.authors.map((a) => a.name).join(', ');
    const description = stripHtml(post.content) || `Confira este artigo do ${SITE_NAME}.`;
    const ogDescription = authorNames ? `Por ${authorNames}. ${description}` : description;
    const imageUrl = resolveImageUrl(post.imageUrl);
    const canonicalUrl = `${SITE_URL}/blog/${post.id}/`;

    return {
        title: `${post.title} | ${SITE_NAME}`,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: post.title,
            description: ogDescription,
            url: canonicalUrl,
            siteName: SITE_NAME,
            locale: 'pt_BR',
            type: 'article',
            images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
            ...(authorNames ? { authors: post.authors.map((a) => a.name) } : {})
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: ogDescription,
            images: [imageUrl]
        }
    };
}

export default function BlogPostPage() {
    return <BlogPostClient />;
}
