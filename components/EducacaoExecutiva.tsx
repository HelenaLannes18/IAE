"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '@/lib/animations';

const PROGRAMAS = [
    {
        id: "01",
        title: "Direito Regulatório",
        desc: "Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800",
        inverse: false
    },
    {
        id: "02",
        title: "Gestão do Departamento Jurídico",
        desc: "Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
        inverse: true
    }
];

export default function EducacaoExecutiva() {
    return (
        <section className="py-24 md:py-32 bg-[#3A3833] relative overflow-hidden">
            {/* Reduzi a largura máxima para 5xl para os cartões ficarem mais concentrados no centro */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Cabeçalho Centrado */}
                <motion.div
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
                    className="text-center mb-16 max-w-3xl mx-auto"
                >
                    <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Educação Executiva
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-sm md:text-base text-gray-300 leading-relaxed font-medium">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.
                    </motion.p>
                </motion.div>

                {/* Grid de Cards Alternados */}
                <div className="space-y-6">
                    {PROGRAMAS.map((programa) => (
                        <motion.div
                            key={programa.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            //@ts-ignore 
                            variants={programa.inverse ? slideInRight : slideInLeft}
                            // FIXA a altura do cartão no desktop para 280px (bem mais achatado/panorâmico)
                            className={`flex flex-col md:flex-row bg-[#BDB3A6] border border-white overflow-hidden group hover:shadow-2xl transition-shadow duration-500 md:h-[280px]`}
                        >
                            {/* --- CAIXA DA IMAGEM --- */}
                            {/* Altura mobile reduzida para h-56 */}
                            <div className={`w-full md:w-1/2 h-56 md:h-full overflow-hidden ${programa.inverse ? 'md:order-2' : 'md:order-1'}`}>
                                <img
                                    src={'/Imagem 5.png'}
                                    alt={programa.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>

                            {/* --- CAIXA DE TEXTO --- */}
                            {/* Paddings e margens reduzidos para caber perfeitamente nos 280px */}
                            <div className={`w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center text-center ${programa.inverse ? 'md:order-1' : 'md:order-2'}`}>
                                <h3 className="text-xl md:text-2xl font-bold text-[#3A3833] mb-3">
                                    {programa.title}
                                </h3>

                                {/* Texto de descrição reduzido ligeiramente em tamanho (text-sm) e margem (mb-5) */}
                                <p className="text-[#4A4740] text-sm leading-relaxed mb-5 max-w-sm line-clamp-3">
                                    {programa.desc}
                                </p>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    // Botão com padding menor para ficar mais delicado
                                    className="border border-[#3A3833] text-[#3A3833] hover:bg-[#3A3833] hover:text-[#BDB3A6] px-6 py-2 text-sm font-semibold transition-colors duration-300"
                                >
                                    Saiba Mais
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}