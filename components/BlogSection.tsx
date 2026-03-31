"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// Apenas 3 posts de destaque para a página inicial
const RECENT_POSTS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
        title: "A evolução da gestão de contratos no cenário corporativo atual",
        category: "Insights",
        readTime: "4 min",
        excerpt: "Descubra como os departamentos jurídicos de alta performance estão a utilizar dados para prever riscos e otimizar resultados."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800",
        title: "Compliance ESG: Mais do que uma exigência, uma vantagem",
        category: "Estratégia",
        readTime: "7 min",
        excerpt: "Por que as metas climáticas e de governança devem fazer parte do núcleo estratégico da sua empresa, e não apenas do relatório anual."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
        title: "Novos paradigmas no Direito Trabalhista em 2026",
        category: "Análise",
        readTime: "5 min",
        excerpt: "Uma análise profunda sobre as recentes alterações regulatórias e o seu impacto direto nas contratações em formato híbrido."
    }
];

export default function BlogSection() {
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
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12"
                >
                    {RECENT_POSTS.map((post) => (
                        <Link href={`/blog/artigo-${post.id}`} key={post.id} className="block group">
                            <motion.article variants={fadeInUp} className="cursor-pointer h-full flex flex-col">

                                {/* Caixa da Imagem */}
                                <div className="w-full aspect-[3/2] bg-[#C7BFB3]/30 mb-6 overflow-hidden rounded-xl shadow-sm">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Categoria e Tempo de Leitura */}
                                <div className="flex items-center gap-3 text-[11px] md:text-xs text-[#9A9186] uppercase tracking-widest mb-3 font-bold">
                                    <span className="text-[#16243A]">{post.category}</span>
                                    <span className="w-1 h-1 bg-[#C7BFB3] rounded-full"></span>
                                    <span>{post.readTime} read</span>
                                </div>

                                {/* Título */}
                                <h3 className="text-xl md:text-2xl font-bold text-[#16243A] leading-snug mb-3 group-hover:text-[#9A9186] transition-colors">
                                    {post.title}
                                </h3>

                                {/* Resumo */}
                                <p className="text-[#3A3733] text-sm leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>

                            </motion.article>
                        </Link>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}