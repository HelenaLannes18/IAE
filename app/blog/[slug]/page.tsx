"use client";

import React, { useRef, useState, useEffect } from 'react';
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

// Mock do Artigo Atual
const ARTICLE_DATA = {
    category: "Insights",
    readTime: "4 min",
    title: "Ut in risus volutpat libero pharetra tempor",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1600",
    date: "8 Maio 2026",
    author: "Lana Teria",
    authorAvatars: [
        "https://i.pravatar.cc/100?img=47",
        "https://i.pravatar.cc/100?img=44",
        "https://i.pravatar.cc/100?img=33"
    ],
    content: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.",
        "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.",
        "Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
        "Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit. Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin."
    ]
};

// Adicionei mais itens para garantir que há conteúdo suficiente para fazer o "arraste" do carrossel
const RELATED_ARTICLES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
        title: "Ut in risus volutpat libero pharetra tempor",
        category: "Insights",
        readTime: "4 min",
        excerpt: "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi..."
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800",
        title: "Lorem ipsum dolor sit amet",
        category: "Strategy",
        readTime: "7 min",
        excerpt: "Why climate goals belong in your core roadmap—not just in the annual..."
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
        title: "Consectetur Adipiscing Elit",
        category: "Insights",
        readTime: "5 min",
        excerpt: "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur..."
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800",
        title: "Ut enim ad minim veniam",
        category: "Funding",
        readTime: "8 min",
        excerpt: "Debunking common assumptions and offering a framework for getting it right."
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=800",
        title: "Duis aute irure dolor in reprehenderit",
        category: "Strategy",
        readTime: "4 min",
        excerpt: "Building responsive systems that keep sustainability strategy adaptive..."
    }
];

export default function BlogPostPage() {
    // --- LÓGICA CORRIGIDA DO CARROSSEL ---
    const carouselRef = useRef<HTMLDivElement>(null);
    const [carouselWidth, setCarouselWidth] = useState(0);

    useEffect(() => {
        // Calcula o limite máximo de scroll: Tamanho total do conteúdo interno - Tamanho visível da tela
        const updateWidth = () => {
            if (carouselRef.current) {
                setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };

        // Roda a verificação assim que carregar
        updateWidth();

        // Recalcula caso o usuário redimensione a janela do navegador
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);
    // ------------------------------------

    return (
        <div className="min-h-screen bg-[#f5f4f0] text-slate-900 font-sans selection:bg-amber-200">
            <Header />

            <main className="pt-32 pb-20 overflow-hidden">

                {/* CABEÇALHO DO ARTIGO */}
                <motion.div
                    initial="hidden" animate="visible" variants={staggerContainer}
                    className="max-w-4xl mx-auto px-4 text-center mb-12"
                >
                    {/* @ts-ignore */}
                    <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 text-xs text-slate-500 uppercase tracking-widest mb-6 font-semibold">
                        <span>{ARTICLE_DATA.category}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span>{ARTICLE_DATA.readTime} read</span>
                    </motion.div>
                    {/* @ts-ignore */}
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        {ARTICLE_DATA.title}
                    </motion.h1>
                </motion.div>

                {/* IMAGEM PRINCIPAL */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-6xl mx-auto px-4 mb-20"
                >
                    <div className="w-full aspect-video md:aspect-[21/9] bg-slate-200 overflow-hidden">
                        <img
                            src={ARTICLE_DATA.image}
                            alt={ARTICLE_DATA.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                {/* CORPO DO ARTIGO */}
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

                    {/* Sidebar Esquerda */}
                    <motion.aside
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                        className="md:col-span-3 order-2 md:order-1"
                    >
                        <div className="sticky top-32 flex flex-row md:flex-col gap-8 md:gap-10 border-t md:border-t-0 pt-8 md:pt-0 border-slate-200">
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Publicado</p>
                                <p className="font-bold text-slate-900 text-sm">{ARTICLE_DATA.date}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-4">Autores</p>

                                <div className="flex -space-x-3 mb-3">
                                    {ARTICLE_DATA.authorAvatars.map((avatar, index) => (
                                        <img
                                            key={index}
                                            src={avatar}
                                            alt={`Autor ${index + 1}`}
                                            className="w-10 h-10 rounded-full border-2 border-[#f5f4f0] object-cover shadow-sm relative hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                                            style={{ zIndex: ARTICLE_DATA.authorAvatars.length - index }}
                                        />
                                    ))}
                                </div>

                                <p className="font-bold text-slate-900 text-sm">{ARTICLE_DATA.author} <span className="font-normal text-slate-500">e equipe</span></p>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Conteúdo do Texto */}
                    <motion.article
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
                        className="md:col-span-9 order-1 md:order-2"
                    >
                        <div className="space-y-8 text-slate-700 text-lg md:text-xl leading-[1.8] tracking-wide">
                            {ARTICLE_DATA.content.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.article>
                </div>

                {/* SEÇÃO "OUTROS ARTIGOS" COM CARROSSEL */}
                <motion.section
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                    className="max-w-7xl mx-auto px-4 mt-32 pt-20 border-t border-slate-200/60"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div>
                            {/* @ts-ignore */}
                            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Outros artigos
                            </motion.h2>
                            {/* @ts-ignore */}
                            <motion.p variants={fadeInUp} className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                Arraste para ver mais
                            </motion.p>
                        </div>
                        {/* @ts-ignore */}
                        <motion.a variants={fadeInUp} href="/blog" className="text-sm font-semibold text-slate-600 hover:text-amber-600 underline underline-offset-4 transition-colors">
                            Ver todos os artigos
                        </motion.a>
                    </div>

                    {/* CONSERTO DO CARROSSEL AQUI */}
                    <div ref={carouselRef} className="w-full overflow-hidden pb-8 cursor-grab active:cursor-grabbing">
                        <motion.div
                            drag="x"
                            // Passamos os limites calculados: vai do 0 (ponto inicial) até o width negativo (fim do carrossel)
                            dragConstraints={{ right: 0, left: -carouselWidth }}
                            whileTap={{ cursor: "grabbing" }}
                            className="flex gap-8 w-max"
                        >
                            {RELATED_ARTICLES.map((post) => (
                                <motion.article
                                    key={post.id}
                                    //  @ts-ignore
                                    variants={fadeInUp}
                                    className="group w-[280px] md:w-[350px] shrink-0"
                                >
                                    <div className="pointer-events-none">
                                        <div className="w-full aspect-[3/2] bg-slate-200 mb-5 overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                        </div>

                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors">
                                            {post.title}
                                        </h3>

                                        <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">
                                            <span>{post.category}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{post.readTime} read</span>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>

            </main>

            <Footer />
        </div>
    );
}