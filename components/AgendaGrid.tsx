"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Variantes de animação
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Interface para tipar os dados que vêm da sua API
interface AgendaItem {
    id: number;
    category: string;
    title: string;
    image: string;
    gridClass: string;
    speakers: string; // Vem como string da API
    link: string | null;
    status: string;
}

export default function AgendaGrid() {
    // Estado para os itens da agenda vindos do banco
    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estado para controlar a posição do mouse e se ele está dentro da seção
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHoveringSection, setIsHoveringSection] = useState(false);

    // Busca os dados da API
    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                const res = await fetch('/api/agenda');
                if (!res.ok) throw new Error('Falha ao buscar agenda');

                const data = await res.json();

                // Filtra para mostrar apenas os itens que estão com status "Ativo"
                const activeItems = data.filter((item: AgendaItem) => item.status === 'Ativo');
                setAgendaItems(activeItems);
            } catch (error) {
                console.error("Erro ao carregar a agenda:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgenda();
    }, []);

    // Lógica para rastrear o mouse na tela
    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            if (isHoveringSection) {
                setMousePosition({ x: e.clientX, y: e.clientY });
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [isHoveringSection]);

    // Função utilitária para transformar a string de palestrantes em array
    // Ex: "João, Maria" -> ["João", "Maria"]
    const formatSpeakers = (speakersStr: string) => {
        if (!speakersStr) return [];
        return speakersStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    };

    return (
        <section
            // cursor-none esconde o ponteiro padrão do sistema
            className="bg-black py-24 px-4 md:px-8 relative cursor-none"
            onMouseEnter={() => setIsHoveringSection(true)}
            onMouseLeave={() => setIsHoveringSection(false)}
        >
            {/* O CURSOR PERSONALIZADO (Bolinha Branca) */}
            <AnimatePresence>
                {isHoveringSection && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
                        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full z-[100] pointer-events-none mix-blend-difference"
                        style={{
                            // Centraliza a bolinha exatamente na ponta do mouse
                            transform: `translate(${mousePosition.x - 8}px, ${mousePosition.y - 8}px)`
                        }}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-[1400px] mx-auto">

                {/* Cabeçalho */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Agenda
                    </h2>
                </motion.div>

                {/* Grid Mosaico */}
                {isLoading ? (
                    // Esqueleto de carregamento sutil enquanto a API responde
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 h-[600px]">
                        <div className="md:col-span-1 md:row-span-2 bg-zinc-900 animate-pulse rounded-sm"></div>
                        <div className="md:col-span-2 md:row-span-1 bg-zinc-900 animate-pulse rounded-sm"></div>
                        <div className="md:col-span-1 md:row-span-1 bg-zinc-900 animate-pulse rounded-sm"></div>
                        <div className="md:col-span-1 md:row-span-1 bg-zinc-900 animate-pulse rounded-sm"></div>
                    </div>
                ) : agendaItems.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 font-bold uppercase tracking-widest">
                        Nenhum evento agendado no momento.
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 bg-black"
                    >
                        {agendaItems.map((item) => (
                            <motion.a
                                href={item.link || "#"}
                                target={item.link ? "_blank" : "_self"}
                                rel={item.link ? "noopener noreferrer" : ""}
                                key={item.id}
                                //@ts-ignore    
                                variants={fadeUp}
                                className={`relative group overflow-hidden bg-zinc-900 block ${item.gridClass}`}
                            >
                                {/* Imagem de Fundo (Grayscale por padrão, colorida no hover) */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                />

                                {/* Overlay Escuro */}
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-700" />

                                {/* Conteúdo Oculto Superior (Palestrantes/Detalhes) - Aparece apenas no hover */}
                                {formatSpeakers(item.speakers).length > 0 && (
                                    <div className="absolute top-6 right-6 md:top-8 md:right-8 flex flex-col items-end text-right opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-10">
                                        <p className="text-[10px] md:text-xs text-white uppercase tracking-widest font-semibold mb-2">
                                            Participações
                                        </p>
                                        {formatSpeakers(item.speakers).map((speaker, idx) => (
                                            <p key={idx} className="text-white text-xs md:text-sm font-light tracking-wide uppercase">
                                                {speaker}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Conteúdo Inferior Fixo (Categoria e Título) */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10 pointer-events-none">
                                    <span className="text-white font-bold tracking-widest text-[10px] md:text-xs mb-3 opacity-80 uppercase">
                                        [ {item.category} ]
                                    </span>

                                    <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-tight transform transition-transform duration-500 group-hover:translate-x-2">
                                        {item.title}
                                    </h3>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                )}

            </div>
        </section>
    );
}