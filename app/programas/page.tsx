"use client";

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { PROGRAMAS, type ProgramaStatus } from '@/lib/programas-data';

// Variantes de animação (mesmo padrão da página "Quem Somos")
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const STATUS_LABEL: Record<ProgramaStatus, string> = {
    "confirmado": "Turma confirmada",
    "lista-de-espera": "Lista de espera",
};

// Imagens por programa (chave = `numero` em lib/programas-data.ts).
// Escolhidas por não conterem pessoas — regra de marca do documento do
// cliente. São placeholders de arquitetura/biblioteca jurídica; troque
// pelas fotos reais da sede (Rua São José, 40) assim que houver ensaio.
const IMAGENS: Record<number, string> = {
    1: "https://images.unsplash.com/flagged/photo-1575245771432-575a7defd3d7?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // biblioteca, corredor de estantes
    2: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1600", // colunas / arquitetura institucional
    3: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600", // estante de livros
};

export default function ProgramasPage() {
    const [selectedStatuses, setSelectedStatuses] = useState<Set<ProgramaStatus>>(new Set());

    const toggleStatus = (value: ProgramaStatus) => {
        const next = new Set(selectedStatuses);
        next.has(value) ? next.delete(value) : next.add(value);
        setSelectedStatuses(next);
    };

    const clearFilters = () => setSelectedStatuses(new Set());

    // destaque = primeiro programa com turma confirmada; se não houver, o primeiro da lista
    const featured = PROGRAMAS.find((p) => p.status === "confirmado") ?? PROGRAMAS[0];

    const filteredProgramas = useMemo(() => {
        return PROGRAMAS.filter((p) => {
            if (p.slug === featured?.slug) return false; // não repete o destaque na grade
            return selectedStatuses.size === 0 || selectedStatuses.has(p.status);
        });
    }, [selectedStatuses, featured]);

    const hasActiveFilters = selectedStatuses.size > 0;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-gray-300">
            <Header />

            <main>
                {/* HERO */}
                <section className="bg-[#111111] text-white pt-40 pb-24 md:pt-56 md:pb-32 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter max-w-4xl uppercase"
                        >
                            Programas para <br className="hidden md:block" />
                            advogados in-house
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-gray-400 text-lg md:text-xl max-w-sm mb-2"
                        >
                            {PROGRAMAS.length} programas executivos presenciais, no Centro do Rio de Janeiro.
                        </motion.p>
                    </div>
                </section>

                {/* DESTAQUE */}
                {featured && (
                    <section className="bg-white py-16 md:py-24 px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            //@ts-ignore
                            variants={fadeInUp}
                            className="max-w-7xl mx-auto"
                        >
                            <div className="bg-[#111111] rounded-2xl overflow-hidden flex flex-col lg:flex-row">
                                <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center text-white">
                                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">
                                        {STATUS_LABEL[featured.status]}
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight leading-[0.95] mb-6">
                                        {featured.h1}
                                    </h2>
                                    <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed mb-8 max-w-md">
                                        {featured.posicionamento}
                                    </p>
                                    <div className="flex items-center gap-3 mb-10">
                                        <span className="border border-white/30 text-white/80 text-xs uppercase tracking-widest px-3 py-1 rounded-full">
                                            Presencial
                                        </span>
                                        <span className={`text-xs uppercase tracking-widest ${featured.status === "confirmado" ? "text-emerald-400" : "text-white/50"}`}>
                                            {featured.status === "confirmado" ? "Início em outubro de 2026" : "Próxima turma a definir"}
                                        </span>
                                    </div>
                                    <Link href={`/programas/${featured.slug}`}>
                                        <button className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all w-fit">
                                            {featured.ctaPrimario}
                                        </button>
                                    </Link>
                                </div>
                                <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto relative">
                                    <img src={IMAGENS[featured.numero] ?? IMAGENS[0]} alt={featured.h1} className="w-full h-full object-cover grayscale" />
                                </div>
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* LISTAGEM + FILTROS */}
                <section className="bg-[#F4F4F4] py-16 md:py-24 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                        {/* SIDEBAR DE FILTROS */}
                        <aside className="w-full lg:w-64 shrink-0">
                            <div className="lg:sticky lg:top-32">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-slate-900">
                                        Filtrar programas
                                    </h3>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs text-slate-500 underline hover:text-slate-900 transition-colors"
                                        >
                                            Limpar
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-3">Situação da turma</p>
                                    <div className="flex flex-col gap-2.5">
                                        {(Object.keys(STATUS_LABEL) as ProgramaStatus[]).map((status) => (
                                            <label key={status} className="flex items-center gap-2.5 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStatuses.has(status)}
                                                    onChange={() => toggleStatus(status)}
                                                    className="w-4 h-4 accent-black cursor-pointer"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                                    {STATUS_LABEL[status]}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* GRID DE PROGRAMAS */}
                        <div className="flex-1">
                            <p className="text-sm text-slate-500 mb-8">
                                {filteredProgramas.length} {filteredProgramas.length === 1 ? "resultado" : "resultados"}
                            </p>

                            {filteredProgramas.length === 0 ? (
                                <div className="py-24 text-center border border-dashed border-slate-300 rounded-2xl">
                                    <p className="text-slate-500 mb-4">Nenhum programa encontrado para os filtros selecionados.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm underline text-slate-900 hover:text-slate-600"
                                    >
                                        Limpar filtros
                                    </button>
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-8">
                                    {filteredProgramas.map((programa, index) => (
                                        <motion.div
                                            key={programa.slug}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-50px" }}
                                            //@ts-ignore
                                            variants={fadeInUp}
                                            transition={{ delay: (index % 4) * 0.05 }}
                                        >
                                            <Link href={`/programas/${programa.slug}`} className="group block">
                                                <div className="aspect-[4/3] overflow-hidden rounded-2xl relative mb-5">
                                                    <img src={IMAGENS[programa.numero] ?? IMAGENS[0]} alt={programa.h1} className="w-full h-full object-cover scale-105 grayscale group-hover:grayscale-0 group-hover:scale-100 transition-all duration-700 ease-out" />
                                                </div>

                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="border border-slate-300 text-slate-500 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                                                        Presencial
                                                    </span>
                                                    <span className={`text-[11px] uppercase tracking-widest ${programa.status === "confirmado" ? "text-emerald-600" : "text-slate-400"}`}>
                                                        {STATUS_LABEL[programa.status]}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 mb-2 leading-tight group-hover:text-slate-600 transition-colors">
                                                    {programa.h1}
                                                </h3>
                                                <p className="text-sm text-slate-500 font-light leading-relaxed">
                                                    {programa.posicionamento}
                                                </p>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="bg-white py-32 px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto flex flex-col items-center"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                            Não encontrou o programa ideal para o seu momento?
                        </h2>
                        <Link href="https://wa.me/5521951114003?text=Olá! Gostaria de saber mais informações sobre o IAE e os proximos programs">
                            <button className="bg-black hover:bg-neutral-800 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all transform hover:scale-105">
                                Fale conosco
                            </button>
                        </Link>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}