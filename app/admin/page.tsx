"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Dados fictícios para a tabela
const MOCK_POSTS = [
    { id: 1, title: "A evolução da gestão de contratos no cenário corporativo atual", category: "Insights", author: "Guga Costa", date: "27 Mar 2026", status: "Publicado" },
    { id: 2, title: "Compliance ESG: Mais do que uma exigência, uma vantagem", category: "Estratégia", author: "Daniela Vilhena", date: "20 Mar 2026", status: "Publicado" },
    { id: 3, title: "Novos paradigmas no Direito Trabalhista em 2026", category: "Análise", author: "Rodrigo Gadben", date: "15 Mar 2026", status: "Rascunho" },
    { id: 4, title: "A inteligência artificial na jurimetria", category: "Tecnologia", author: "José G. Costa", date: "10 Mar 2026", status: "Publicado" },
];

export default function AdminBlogArea() {
    const [currentView, setCurrentView] = useState<'list' | 'create'>('list');

    return (
        // Fundo principal Off-White Elegante e Texto Marrom Escuro
        <div className="min-h-screen bg-[#F3F1EC] flex flex-col md:flex-row font-sans text-[#3A3733]">

            {/* --- SIDEBAR (Barra Lateral) --- */}
            {/* Azul Profundo */}
            <aside className="w-full md:w-64 bg-[#16243A] text-[#C7BFB3] flex flex-col shadow-2xl z-20 shrink-0">
                <div className="h-20 flex items-center px-8 border-b border-[#F3F1EC]/10">
                    <span className="text-2xl font-bold text-[#F3F1EC] tracking-widest">IAE<span className="text-[#9A9186]">.</span></span>
                </div>

                <nav className="flex-1 py-8 px-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Dashboard
                    </a>
                    {/* Link Ativo - Destaque com Off-White */}
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F3F1EC]/10 text-[#F3F1EC] font-semibold border border-[#F3F1EC]/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" /></svg>
                        Gestão do Blog
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#C7BFB3] hover:bg-[#F3F1EC]/5 hover:text-[#F3F1EC] transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        Usuários
                    </a>
                </nav>

                <div className="p-4 border-t border-[#F3F1EC]/10">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-[#9A9186] flex items-center justify-center text-[#16243A] font-bold text-sm">A</div>
                        <div className="text-sm">
                            <p className="text-[#F3F1EC] font-semibold">Admin</p>
                            <p className="text-xs text-[#C7BFB3]">admin@iae.com.br</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- ÁREA PRINCIPAL (Conteúdo) --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Topbar */}
                <header className="h-20 bg-[#F3F1EC] border-b border-[#C7BFB3]/50 flex items-center justify-between px-8 shrink-0">
                    {/* Títulos em Azul Profundo */}
                    <h1 className="text-xl font-bold text-[#16243A]">
                        {currentView === 'list' ? 'Artigos do Blog' : 'Novo Artigo'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <button className="text-[#9A9186] hover:text-[#16243A] transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative">
                    <AnimatePresence mode="wait">

                        {/* TELA 1: LISTA DE ARTIGOS */}
                        {currentView === 'list' && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                                className="max-w-6xl mx-auto"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                                    <div className="relative w-full sm:w-96">
                                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9186]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        <input type="text" placeholder="Buscar artigos..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C7BFB3] rounded-lg text-sm text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all shadow-sm" />
                                    </div>
                                    <button
                                        onClick={() => setCurrentView('create')}
                                        // Botões em Azul Profundo
                                        className="bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#16243A]/20 transition-all w-full sm:w-auto justify-center"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Criar Novo Artigo
                                    </button>
                                </div>

                                <div className="bg-white border border-[#C7BFB3]/60 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-[#F3F1EC]/50 border-b border-[#C7BFB3]/50 text-xs uppercase tracking-wider text-[#9A9186] font-semibold">
                                                    <th className="px-6 py-4">Título</th>
                                                    <th className="px-6 py-4">Categoria</th>
                                                    <th className="px-6 py-4">Autor</th>
                                                    <th className="px-6 py-4">Data</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#C7BFB3]/30">
                                                {MOCK_POSTS.map((post) => (
                                                    <tr key={post.id} className="hover:bg-[#F3F1EC]/60 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <p className="font-semibold text-[#3A3733] truncate max-w-xs" title={post.title}>{post.title}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-[#3A3733]/80">{post.category}</td>
                                                        <td className="px-6 py-4 text-sm text-[#3A3733]/80">{post.author}</td>
                                                        <td className="px-6 py-4 text-sm text-[#9A9186]">{post.date}</td>
                                                        <td className="px-6 py-4">
                                                            {/* Status usando cores da marca em vez de verde/cinza genérico */}
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'Publicado' ? 'bg-[#16243A] text-[#F3F1EC]' : 'bg-[#C7BFB3]/40 text-[#3A3733]'}`}>
                                                                {post.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button className="p-2 text-[#9A9186] hover:text-[#16243A] hover:bg-[#C7BFB3]/20 rounded-lg transition-colors" title="Editar">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                </button>
                                                                <button className="p-2 text-[#9A9186] hover:text-[#3A3733] hover:bg-[#C7BFB3]/20 rounded-lg transition-colors" title="Excluir">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-4 border-t border-[#C7BFB3]/50 bg-[#F3F1EC]/30 flex items-center justify-between text-sm text-[#9A9186]">
                                        <span>Mostrando 1 a 4 de 24 artigos</span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 border border-[#C7BFB3] rounded hover:bg-[#C7BFB3]/30 transition-colors" disabled>Anterior</button>
                                            <button className="px-3 py-1 border border-[#C7BFB3] rounded hover:bg-[#C7BFB3]/30 transition-colors bg-white text-[#3A3733]">Próxima</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TELA 2: CRIAR NOVO ARTIGO */}
                        {currentView === 'create' && (
                            <motion.div
                                key="create"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                                className="max-w-4xl mx-auto"
                            >
                                <button
                                    onClick={() => setCurrentView('list')}
                                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#9A9186] hover:text-[#16243A] transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                    Voltar para a lista
                                </button>

                                <div className="bg-white rounded-2xl shadow-sm border border-[#C7BFB3]/60 p-6 md:p-10">
                                    <form className="space-y-8">

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="md:col-span-2 space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Título do Artigo</label>
                                                    <input type="text" placeholder="Ex: O futuro do compliance..." className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] focus:bg-white transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Conteúdo</label>
                                                    <div className="border border-[#C7BFB3] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#16243A]/20 focus-within:border-[#16243A] transition-all bg-white">
                                                        <div className="flex gap-2 border-b border-[#C7BFB3]/50 p-2 bg-[#F3F1EC]/50">
                                                            <button type="button" className="p-1.5 hover:bg-[#C7BFB3]/40 rounded text-[#3A3733]"><b className="font-serif">B</b></button>
                                                            <button type="button" className="p-1.5 hover:bg-[#C7BFB3]/40 rounded text-[#3A3733]"><i className="font-serif">I</i></button>
                                                            <button type="button" className="p-1.5 hover:bg-[#C7BFB3]/40 rounded text-[#3A3733] underline">U</button>
                                                            <div className="w-px h-6 bg-[#C7BFB3] mx-1"></div>
                                                            <button type="button" className="p-1.5 hover:bg-[#C7BFB3]/40 rounded text-[#3A3733]">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                                            </button>
                                                        </div>
                                                        <textarea rows={12} placeholder="Escreva o seu artigo aqui..." className="w-full px-4 py-3 bg-[#F3F1EC]/30 text-[#3A3733] focus:bg-white focus:outline-none resize-none"></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="bg-[#F3F1EC]/50 p-5 rounded-xl border border-[#C7BFB3]/60">
                                                    <h3 className="font-bold text-[#16243A] mb-4 pb-4 border-b border-[#C7BFB3]/50">Publicação</h3>
                                                    <button type="button" className="w-full bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] py-3 rounded-lg font-bold shadow-md transition-colors mb-3">
                                                        Publicar Artigo
                                                    </button>
                                                    <button type="button" className="w-full bg-white hover:bg-[#C7BFB3]/20 border border-[#9A9186] text-[#3A3733] py-3 rounded-lg font-bold transition-colors">
                                                        Salvar Rascunho
                                                    </button>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Categoria</label>
                                                    <select className="w-full px-4 py-3 bg-[#F3F1EC]/50 border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all">
                                                        <option>Insights</option>
                                                        <option>Estratégia</option>
                                                        <option>Direito Trabalhista</option>
                                                        <option>Tributário</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-[#3A3733] mb-2">Imagem de Capa</label>
                                                    <div className="border-2 border-dashed border-[#9A9186] rounded-xl p-6 text-center hover:bg-[#F3F1EC] hover:border-[#16243A] transition-colors cursor-pointer group">
                                                        <svg className="w-8 h-8 text-[#9A9186] mx-auto mb-2 group-hover:text-[#16243A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        <p className="text-xs text-[#9A9186] font-medium">Clique para fazer upload</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>

        </div>
    );
}