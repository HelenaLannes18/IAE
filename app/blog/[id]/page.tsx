"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link'; // Adicionado para arrumar os links do carrossel
import { useParams } from 'next/navigation'; // Para pegar o ID da URL

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

const CATEGORIES = ["Todos", "Insights", "Strategy", "Funding"];

export default function BlogPostPage() {
    const params = useParams(); // Pega o ID da URL
    const postId = params.id;

    // Estados para os dados reais
    const [article, setArticle] = useState<any>(null);
    const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    // Funções auxiliares (Limpeza de HTML e Tempo de Leitura)
    const stripHtmlAndTruncate = (html: string, maxLength: number = 120) => {
        if (!html) return "";
        const plainText = html.replace(/<[^>]+>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    const calculateReadTime = (html: string) => {
        if (!html) return "1 min";
        const wordCount = html.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
        return `${Math.ceil(wordCount / 200)} min`;
    };

    useEffect(() => {
        // Busca o artigo atual e todos os artigos para o carrossel
        const fetchData = async () => {
            try {
                // 1. Busca todos os posts para usar na seção de relacionados
                const resAll = await fetch('/api/posts');
                const allPosts = await resAll.json();

                if (allPosts && Array.isArray(allPosts)) {
                    // 2. Encontra o post específico (o atual)
                    const current = allPosts.find((p: any) => p.id.toString() === postId);

                    if (current) {
                        // Formata a data
                        const dateObj = new Date(current.createdAt);
                        current.formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
                        setArticle(current);
                    }

                    // 3. Filtra os outros posts (removendo o atual) para a lista de relacionados
                    const others = allPosts.filter((p: any) => p.id.toString() !== postId);
                    setRelatedArticles(others);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do blog:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (postId) {
            fetchData();
        }
    }, [postId]);

    // Lógica de Filtro e Pesquisa (Agora usando dados reais)
    const filteredArticles = relatedArticles.filter((post) => {
        const plainContent = stripHtmlAndTruncate(post.content, 200);
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plainContent.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Simulando fixados (se você tiver uma flag no banco depois, altere aqui)
    const pinnedArticles = filteredArticles.slice(0, 2);
    const commonArticles = filteredArticles.slice(2);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-[#f5f4f0] flex flex-col items-center justify-center text-slate-900">
                <Header />
                <h1 className="text-3xl font-bold mb-4">Artigo não encontrado.</h1>
                <Link href="/blog" className="text-[#9A9186] hover:underline">Voltar para o Blog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f4f0] text-slate-900 font-sans selection:bg-amber-200">
            <Header />

            <main className="pt-32 pb-20 overflow-hidden">

                {/* CABEÇALHO DO ARTIGO */}
                <motion.div
                    initial="hidden" animate="visible" variants={staggerContainer}
                    className="max-w-4xl mx-auto px-4 text-center mb-12"
                >
                    <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 text-xs text-slate-500 uppercase tracking-widest mb-6 font-semibold">
                        <span>{article.category}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span>{calculateReadTime(article.content)} read</span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        {article.title}
                    </motion.h1>
                </motion.div>

                {/* IMAGEM PRINCIPAL */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-4xl mx-auto px-4 mb-16"
                >
                    <div className="w-full h-24 md:h-36 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border border-slate-200/50">
                        <img
                            src={article.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1600"}
                            alt={article.title}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                </motion.div>

                {/* CORPO DO ARTIGO */}
                <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-10">
                    <motion.aside
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                        className="md:col-span-3 order-2 md:order-1"
                    >
                        <div className="sticky top-32 flex flex-row md:flex-col gap-8 md:gap-10 border-t md:border-t-0 pt-8 md:pt-0 border-slate-200">
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-1">Publicado</p>
                                <p className="font-bold text-slate-900 text-sm">{article.formattedDate}</p>
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-widest text-slate-500 mb-4">Autores</p>
                                <div className="flex -space-x-3 mb-3">
                                    <img
                                        src="https://i.pravatar.cc/100?img=47" // Avatar padrão (pode adicionar foto no model de User depois)
                                        alt="Autor"
                                        className="w-10 h-10 rounded-full border-2 border-[#f5f4f0] object-cover shadow-sm relative hover:z-10 hover:scale-110 transition-transform cursor-pointer"
                                    />
                                </div>
                                <p className="font-bold text-slate-900 text-sm">{article.author?.name || 'Administrador'}</p>
                            </div>
                        </div>
                    </motion.aside>

                    <motion.article
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
                        className="md:col-span-9 order-1 md:order-2"
                    >
                        {/* RENDERIZAÇÃO DO HTML DO BANCO DE DADOS (DANGEROUSLY SET INNER HTML) */}
                        <div
                            className="space-y-6 text-slate-700 text-lg leading-[1.8] tracking-wide prose prose-lg prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </motion.article>
                </div>

                {/* NOVA PROPAGANDA DO CURSO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto mt-20 px-4"
                >
                    <div className="relative bg-[#0a0a0a] text-white overflow-hidden py-16 md:py-20 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl rounded-sm">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600')] bg-cover bg-center mix-blend-luminosity grayscale pointer-events-none"></div>
                        <h3 className="relative z-10 text-3xl md:text-4xl lg:text-[2.5rem] font-light tracking-wide md:max-w-xl text-center md:text-left leading-snug">
                            Dê o próximo passo na estruturação do seu negócio hoje.
                        </h3>
                        <div className="relative z-10 shrink-0">
                            <button className="flex items-center gap-4 bg-white hover:bg-gray-100 text-black rounded-full pl-6 pr-2 py-2 transition-all group shadow-xl">
                                <span className="text-sm font-medium tracking-wide">Conhecer o Curso</span>
                                <div className="bg-[#e5e7eb] group-hover:bg-[#d1d5db] transition-colors rounded-full p-2.5 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* SEÇÃO DE FILTROS E CARROSSEIS */}
                <motion.section
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                    className="max-w-5xl mx-auto px-4 mt-24 pt-16 border-t border-slate-200/60"
                >
                    <div className="mb-10 text-left">
                        <motion.h2 variants={fadeInUp} className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
                            Explore mais artigos
                        </motion.h2>

                        <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <div className="relative w-full md:w-1/2">
                                <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Pesquisar artigos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-50 pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm"
                                />
                            </div>

                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCategory === category
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {filteredArticles.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center py-12 text-slate-500"
                            >
                                Nenhum artigo encontrado para a sua busca.
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="space-y-16"
                            >
                                {/* CARROSSEL: FIXADOS (MOCK) */}
                                {pinnedArticles.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-amber-500 rounded-sm"></span>
                                            Destaques
                                        </h3>
                                        <DraggableCarousel articles={pinnedArticles} />
                                    </div>
                                )}

                                {/* CARROSSEL: ÚLTIMOS DATADOS */}
                                {commonArticles.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-slate-400 rounded-sm"></span>
                                            Últimos Publicados
                                        </h3>
                                        <DraggableCarousel articles={commonArticles} />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </motion.section>
            </main>

            <Footer />
        </div>
    );
}

// Sub-componente do Carrossel Arrastável (Adaptado para dados reais)
function DraggableCarousel({ articles }: { articles: any[] }) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [carouselWidth, setCarouselWidth] = useState(0);

    const stripHtmlAndTruncate = (html: string, maxLength: number = 120) => {
        if (!html) return "";
        const plainText = html.replace(/<[^>]+>/g, '');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    const calculateReadTime = (html: string) => {
        if (!html) return "1 min";
        const wordCount = html.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
        return `${Math.ceil(wordCount / 200)} min`;
    };

    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                const scrollW = carouselRef.current.scrollWidth;
                const offsetW = carouselRef.current.offsetWidth;
                setCarouselWidth(scrollW > offsetW ? scrollW - offsetW : 0);
            }
        };

        updateWidth();
        // Um pequeno timeout garante que as imagens carregaram antes de calcular
        setTimeout(updateWidth, 100);
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [articles]);

    return (
        <div ref={carouselRef} className="w-full overflow-hidden pb-8 cursor-grab active:cursor-grabbing">
            <motion.div
                drag="x"
                dragConstraints={{ right: 0, left: -carouselWidth }}
                whileTap={{ cursor: "grabbing" }}
                className="flex gap-6 w-max"
            >
                {articles.map((post) => (
                    // ADICIONADO: Link para o carrossel funcionar
                    <Link href={`/blog/${post.id}`} key={post.id} className="pointer-events-auto">
                        <motion.article
                            //@ts-ignore
                            variants={fadeInUp}
                            className="group w-[280px] md:w-[320px] shrink-0"
                        >
                            <div className="pointer-events-none">
                                <div className="w-full aspect-[4/3] bg-slate-200 mb-4 overflow-hidden rounded-xl">
                                    <img
                                        src={post.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800"}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                </div>

                                <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-2 font-semibold">
                                    <span>{post.category}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>{calculateReadTime(post.content)} read</span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                                    {stripHtmlAndTruncate(post.content, 100)}
                                </p>
                            </div>
                        </motion.article>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}