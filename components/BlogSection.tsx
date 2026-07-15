"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// Interface para tipar os dados que vêm da sua API
interface Post {
    id: number;
    title: string;
    category: string;
    content: string;
    imageUrl: string;
    status: string;
    createdAt: string;
}

export default function BlogSection() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts');
                if (!res.ok) throw new Error('Falha ao buscar os posts');

                const data = await res.json();

                // Pega apenas os 3 primeiros posts. 
                // DICA: Se quiser exibir apenas os publicados, descomente o trecho abaixo:
                // const publicados = data.filter((p: Post) => p.status === 'Publicado');
                // setPosts(publicados.slice(0, 3));

                setPosts(data.slice(0, 3));
            } catch (error) {
                console.error("Erro ao carregar os artigos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Função para remover as tags HTML do 'content' e criar o resumo
    const stripHtmlAndTruncate = (html: string, maxLength: number = 120) => {
        if (!html) return "";
        const plainText = html.replace(/<[^>]+>/g, ''); // Remove as tags HTML
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    // Função para calcular tempo de leitura (baseado na média de 200 palavras por minuto)
    const calculateReadTime = (html: string) => {
        if (!html) return "1 min";
        const plainText = html.replace(/<[^>]+>/g, '');
        const wordCount = plainText.trim().split(/\s+/).length;
        const minutes = Math.ceil(wordCount / 200);
        return `${minutes} min`;
    };

    return (
        // Fundo principal Off-White Elegante
        <section className="py-24 md:py-32 bg-[#F3F1EC] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Cabeçalho da Secção */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
                    >
                        {/* Linha decorativa Taupe Sofisticado */}
                        <div className="w-16 h-1.5 bg-[#9A9186] mb-6 rounded-full"></div>
                        {/* Título Azul Profundo com destaque em Taupe */}
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#16243A] tracking-tight">
                            Artigos e <span className="text-[#9A9186]">Insights</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
                    >
                        {/* Link Azul Profundo com hover em Taupe */}
                        <Link href="/blog" className="inline-flex items-center gap-2 group text-[#16243A] font-bold hover:text-[#9A9186] transition-colors uppercase tracking-widest text-sm border-b-2 border-transparent hover:border-[#9A9186] pb-1">
                            Ver todos os artigos
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

                {/* Grid de 3 Colunas para os Posts */}
                {isLoading ? (
                    // Esqueleto de carregamento enquanto a API responde
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                        {[1, 2, 3].map((skeleton) => (
                            <div key={skeleton} className="animate-pulse flex flex-col h-full">
                                <div className="w-full aspect-[3/2] bg-gray-300 mb-6 rounded-xl"></div>
                                <div className="h-4 bg-gray-300 w-1/3 mb-4 rounded"></div>
                                <div className="h-6 bg-gray-300 w-full mb-3 rounded"></div>
                                <div className="h-6 bg-gray-300 w-2/3 mb-4 rounded"></div>
                                <div className="h-4 bg-gray-300 w-full mb-2 rounded"></div>
                                <div className="h-4 bg-gray-300 w-full rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    // Mensagem caso não haja nenhum artigo no banco
                    <div className="text-center text-[#9A9186] py-10 font-medium">
                        Nenhum artigo publicado no momento.
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12"
                    >
                        {posts.map((post) => (
                            <Link href={`/blog/${post.id}`} key={post.id} className="block group">
                                <motion.article variants={fadeInUp} className="cursor-pointer h-full flex flex-col">

                                    {/* Caixa da Imagem */}
                                    <div className="w-full aspect-[3/2] bg-[#C7BFB3]/30 mb-6 overflow-hidden rounded-xl shadow-sm">
                                        <img
                                            // Fallback caso o post venha sem imagem
                                            src={post.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800"}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>

                                    {/* Categoria e Tempo de Leitura (Calculado Dinamicamente) */}
                                    <div className="flex items-center gap-3 text-[11px] md:text-xs text-[#9A9186] uppercase tracking-widest mb-3 font-bold">
                                        <span className="text-[#16243A]">{post.category}</span>
                                        <span className="w-1 h-1 bg-[#C7BFB3] rounded-full"></span>
                                        <span>{calculateReadTime(post.content)} read</span>
                                    </div>

                                    {/* Título */}
                                    <h3 className="text-xl md:text-2xl font-bold text-[#16243A] leading-snug mb-3 group-hover:text-[#9A9186] transition-colors">
                                        {post.title}
                                    </h3>

                                    {/* Resumo (Limpando o HTML) */}
                                    <p className="text-[#3A3733] text-sm leading-relaxed line-clamp-3">
                                        {stripHtmlAndTruncate(post.content)}
                                    </p>

                                </motion.article>
                            </Link>
                        ))}
                    </motion.div>
                )}

            </div>
        </section>
    );
}