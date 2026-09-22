"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '@/lib/animations';
import { PROGRAMAS, IMAGENS_PROGRAMA } from '@/lib/programas-data';

// Ordem de exibição na home (alinhado internamente: tributário e gestão são os primeiros a lançar)
const ORDEM_HOME = ['direito-tributario', 'gestao-do-departamento-juridico', 'direito-regulatorio'];

// Imagens escolhidas para a home (mesmas imagens já aprovadas — não trocar por novas sem pedir)
const FOTO_PB = 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const IMAGENS_HOME: Record<string, string> = {
    'direito-tributario': 'https://images.unsplash.com/photo-1787684047991-0241318b066a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'gestao-do-departamento-juridico': 'https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'direito-regulatorio': FOTO_PB,
};
const GRAYSCALE_HOME = new Set(['direito-tributario', 'direito-regulatorio']);

const programasHome = ORDEM_HOME
    .map((slug) => PROGRAMAS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PROGRAMAS)[number] => Boolean(p));

export default function EducacaoExecutiva() {
    return (
        <section id="programas-executivos" className="py-24 md:py-32 bg-[#3A3833] relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Cabeçalho Centrado */}
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Programas Executivos
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                        Programas desenvolvidos para profissionais que atuam em ambientes corporativos, regulados e estratégicos.
                    </motion.p>
                </motion.div>

                {/* Grid de Cards Alternados */}
                <div className="space-y-8">
                    {programasHome.map((programa, index) => {
                        const inverse = index % 2 === 1;
                        const imagem = IMAGENS_HOME[programa.slug] || IMAGENS_PROGRAMA[programa.numero];

                        return (
                            <motion.div
                                key={programa.slug}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                //@ts-ignore
                                variants={inverse ? slideInRight : slideInLeft}
                                className={`flex flex-col md:flex-row bg-[#e4e0e0] rounded-2xl overflow-hidden group hover:shadow-2xl transition-shadow duration-500 md:h-[280px]`}
                            >
                                {/* --- CAIXA DA IMAGEM --- */}
                                <div className={`w-full md:w-1/2 h-56 md:h-full overflow-hidden ${inverse ? 'md:order-2' : 'md:order-1'}`}>
                                    <img
                                        src={imagem}
                                        alt={programa.h1}
                                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out ${GRAYSCALE_HOME.has(programa.slug) ? 'grayscale' : ''}`}
                                    />
                                </div>

                                {/* --- CAIXA DE TEXTO --- */}
                                <div className={`w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center text-center ${inverse ? 'md:order-1' : 'md:order-2'}`}>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#3A3833] mb-3">
                                        {programa.h1}
                                    </h3>

                                    <p className="text-[#4A4740] text-sm leading-relaxed mb-5 max-w-sm line-clamp-3">
                                        {programa.posicionamento}
                                    </p>

                                    {/* Transformado em tag <a> para navegação correta */}
                                    <motion.a
                                        href={`/programas/${programa.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="border border-[#3A3833] rounded-full text-[#3A3833] hover:bg-[#3A3833] hover:text-[#BDB3A6] px-6 py-2 text-sm font-semibold transition-colors duration-300 text-center inline-block"
                                    >
                                        Conhecer Programa
                                    </motion.a>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
