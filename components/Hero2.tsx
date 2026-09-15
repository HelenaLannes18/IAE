"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import Link from 'next/link';

// Array de Mídias Atualizado
const BACKGROUND_MEDIA = [
    {
        id: 1,
        type: 'image',
        // Foto 1: Escritório minimalista e moderno
        src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600'
    },
    {
        id: 2,
        type: 'image',
        // Foto 2: Nova foto (Fachada corporativa de vidro muito legal e imponente)
        src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600'
    },
    {
        id: 3,
        type: 'image',
        // Foto 3: Sala de reuniões elegante
        src: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=1600'
    }
    /* 
    ========================================================================
    PARA ADICIONAR UM VÍDEO MUITO LEGAL SEM TELA PRETA:
    1. Vá em sites como Pexels ou Pixabay e baixe um vídeo corporativo em .mp4
    2. Coloque o arquivo dentro da pasta "public" do seu projeto (ex: bg-video.mp4)
    3. Substitua o objeto acima por este abaixo:
    ========================================================================
    {
        id: 3,
        type: 'video',
        src: '/bg-video.mp4' 
    }
    */
];

export default function Hero() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Lógica do Slider (Troca a cada 6 segundos)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_MEDIA.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative w-full min-h-screen flex items-center pt-20 overflow-hidden bg-neutral-900"
        >
            {/* BACKGROUND SLIDER */}
            {BACKGROUND_MEDIA.map((media, index) => (
                <div
                    key={media.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                        }`}
                >
                    {media.type === 'video' ? (
                        <video
                            src={media.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover object-center"
                        />
                    ) : (
                        <img
                            src={media.src}
                            alt={`Background ${index}`}
                            // Otimização: avisa ao navegador para priorizar o carregamento dessas imagens
                            loading="eager"
                            className="w-full h-full object-cover object-center"
                        />
                    )}
                </div>
            ))}

            {/* OVERLAY SUTIL */}
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

            {/* CONTEÚDO PRINCIPAL */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left mb-32">
                <div className="max-w-2xl">
                    <motion.h1
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-8"
                    >
                        IAE: Conectando <br />
                        a técnica jurídica <br />
                        à realidade <br />
                        corporativa.
                    </motion.h1>

                    <motion.div variants={fadeInUp} className="w-full h-[1px] bg-white/30 mb-8"></motion.div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <motion.p
                            variants={fadeInUp}
                            className="text-base md:text-lg text-gray-200 leading-relaxed max-w-md drop-shadow-md"
                        >
                            Programas executivos conduzidos por profissionais com ampla experiência de mercado. Conhecimento jurídico aplicado aos desafios reais das organizações.
                        </motion.p>
                        <Link href="/sobre">
                            <motion.div variants={fadeInUp}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-xs tracking-widest uppercase transition-all shadow-lg"
                                >
                                    Saiba Mais +
                                </motion.button>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ELEMENTOS ESTÉTICOS DA REFERÊNCIA (Tipografia Vazada Gigante) */}
            {/* <div className="absolute bottom-12 left-0 w-full px-4 sm:px-6 lg:px-12 flex justify-between items-end z-20 pointer-events-none overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}
                    className="w-full flex justify-between gap-4"
                >
                    <span
                        className="text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-none"
                        style={{
                            WebkitTextFillColor: 'transparent',
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.6)'
                        }}
                    >
                        EXPERTISE
                    </span>
                    <span
                        className="hidden md:block text-5xl md:text-8xl lg:text-[9rem] font-black uppercase tracking-tighter leading-none"
                        style={{
                            WebkitTextFillColor: 'transparent',
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.6)'
                        }}
                    >
                        PROJECTS
                    </span>
                </motion.div>
            </div> */}

            {/* INDICADOR DE SCROLL DOWN CENTRALIZADO */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
            >
                <span className="text-[9px] uppercase tracking-[0.3em] text-white font-semibold">Scroll Down</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-[1px] h-8 bg-white/70"
                />
            </motion.div>

            {/* CONTROLES DO SLIDER */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
                {BACKGROUND_MEDIA.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-1.5 transition-all duration-300 ${idx === currentIndex ? 'h-8 bg-white' : 'h-1.5 bg-white/40 hover:bg-white/70 rounded-full'
                            }`}
                        aria-label={`Ir para o slide ${idx + 1}`}
                    />
                ))}
            </div>

        </motion.section>
    );
}