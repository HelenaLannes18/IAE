"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Variantes de animação suaves
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function QuemSomos() {
    // Ref para criar o efeito Parallax na imagem
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // A imagem vai mover ligeiramente no eixo Y para criar o parallax
    const yParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        // Fundo com a cor Off-White Elegante do manual da marca
        <section className="py-24 md:py-32 bg-[#F3F1EC] relative overflow-hidden" ref={containerRef}>

            {/* Decoração de fundo sutil usando o Greige Institucional com transparência */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C7BFB3]/20 pointer-events-none rounded-l-[10rem] -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Layout lado a lado no desktop: texto na esquerda (col-span-5) e imagem na direita (col-span-7) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                    {/* COLUNA ESQUERDA: Título e Texto */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                        >
                            {/* Linha decorativa na cor Taupe Sofisticado */}
                            <div className="w-16 h-1.5 bg-[#9A9186] mb-6 rounded-full"></div>

                            {/* Título na cor Azul Profundo */}
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#16243A] tracking-tight leading-tight mb-8">
                                Quem Somos.
                            </h2>
                        </motion.div>

                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, delay: 0.2 }} variants={fadeInUp}
                            className="space-y-6"
                        >
                            {/* Texto 1 na cor Marrom Escuro (texto principal) */}
                            <p className="text-lg md:text-xl text-[#3A3733] leading-relaxed font-medium">
                                Uma iniciativa dedicada à formação de advogados preparados para <strong className="text-[#16243A]">enfrentar os desafios reais</strong> do ambiente empresarial.
                            </p>

                            {/* Texto 2 na cor Taupe Sofisticado (subtítulos/texto secundário) para criar hierarquia */}
                            <p className="text-base md:text-lg text-[#9A9186] leading-relaxed">
                                Nossos programas executivos foram concebidos para aproximar a técnica jurídica da prática corporativa, conectando o conhecimento acadêmico à experiência de profissionais que atuam diretamente em empresas, escritórios e posições de liderança no setor público e privado.
                            </p>
                        </motion.div>
                    </div>

                    {/* COLUNA DIREITA: Imagem com Parallax */}
                    <div className="lg:col-span-7 w-full h-full mt-10 lg:mt-0">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, delay: 0.4 }} variants={fadeInUp}
                            // Adicionada uma borda super sutil na cor Greige para emoldurar a imagem
                            className="w-full h-full min-h-[400px] lg:min-h-[600px] rounded-[2rem] overflow-hidden shadow-2xl relative border border-[#C7BFB3]/50"
                        >
                            <motion.img
                                style={{ y: yParallax, scale: 1.15 }} // Scale maior dá margem para o parallax
                                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600"
                                alt="Equipa executiva"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Overlay elegante usando a cor Azul Profundo para unificar com o design */}
                            <div className="absolute inset-0 bg-[#16243A]/10 mix-blend-multiply"></div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}