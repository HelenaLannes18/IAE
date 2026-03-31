"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Variantes de animação
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

// Mock de dados para os posts do blog
const BLOG_POSTS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
        title: "Ut enim ad minima veniam, quis nostrum exercitationem",
        category: "Insights",
        readTime: "4 min",
        excerpt: "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800",
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        category: "Strategy",
        readTime: "7 min",
        excerpt: "Why climate goals belong in your core roadmap—not just in the annual ESG report."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800",
        title: "Consectetur adipiscing elit, sed do eiusmod tempor",
        category: "Insights",
        readTime: "5 min",
        excerpt: "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh."
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
        title: "Sed do eiusmod tempor incididunt ut labore et dolore",
        category: "Testing",
        readTime: "6 min",
        excerpt: "Why legacy tools aren't enough—and what the next generation of reporting looks like."
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800",
        title: "Ut enim ad minim veniam, quis nostrud exercitation",
        category: "Funding",
        readTime: "8 min",
        excerpt: "Debunking common assumptions and offering a framework for getting it right."
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=800",
        title: "Duis aute irure dolor in reprehenderit in voluptate",
        category: "Strategy",
        readTime: "4 min",
        excerpt: "Building responsive systems that keep sustainability strategy adaptive and actionable."
    }
];

export default function BlogPage() {
    return (
        // Fundo off-white elegante como no design do Figma
        <div className="min-h-screen bg-[#f5f4f0] text-slate-900 font-sans selection:bg-amber-200">

            {/* Importa o mesmo Header da Landing Page */}
            <Header />

            {/* ALTERAÇÃO AQUI: max-w-5xl virou max-w-7xl para expandir todo o conteúdo */}
            <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HERO IMAGE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    // ALTERAÇÃO AQUI: aspect ratio ajustado para 21/9 no desktop (fica menos "achatada" e mais alta)
                    className="w-full aspect-video md:aspect-[21/9] mb-16 overflow-hidden bg-slate-200 cursor-pointer group"
                >
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600"
                        alt="Equipe em reunião"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                </motion.div>

                {/* TÍTULO DA SEÇÃO */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Últimas Notícias</h1>
                </motion.div>

                {/* GRID DE POSTS */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
                >
                    {BLOG_POSTS.map((post) => (
                        <motion.article key={post.id} variants={fadeInUp} className="group cursor-pointer">
                            {/* Imagem do Post */}
                            <div className="w-full aspect-[3/2] bg-slate-200 mb-5 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>

                            {/* Título */}
                            <h2 className="text-xl md:text-3xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-amber-600 transition-colors">
                                {post.title}
                            </h2>

                            {/* Meta Info (Categoria e Tempo de Leitura) */}
                            <div className="flex items-center gap-4 text-xs text-slate-500 uppercase tracking-widest mb-4 font-semibold">
                                <span>{post.category}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{post.readTime} read</span>
                            </div>

                            {/* Resumo (Excerpt) */}
                            <p className="text-slate-600 text-base leading-relaxed">
                                {post.excerpt}
                            </p>
                        </motion.article>
                    ))}
                </motion.div>

                {/* SEÇÃO DE NEWSLETTER */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-32 mb-16 text-center border-t border-slate-200/60 pt-24"
                >
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Gostou do conteúdo?</h3>
                    <button className="bg-[#2b2b2b] hover:bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg shadow-black/10 flex items-center gap-3 mx-auto">
                        <span>Assine a nossa newsletter</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </motion.section>

            </main>

            {/* Importa o mesmo Footer da Landing Page */}
            <Footer />

        </div>
    );
}