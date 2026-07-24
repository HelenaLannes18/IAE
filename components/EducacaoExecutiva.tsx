"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, slideInLeft, slideInRight } from '@/lib/animations';

const PROGRAMAS = [
    {
        id: "01",
        title: "Direito Regulatório",
        slug: "direito-regulatorio",
        desc: "Compreenda a lógica regulatória aplicada aos setores estratégicos da economia e desenvolva visão prática sobre governança, risco e atuação institucional.",
        // Imagem nova: Ambiente corporativo elegante e foco estratégico
        image: "https://plus.unsplash.com/premium_photo-1726704130632-9c4bcc66410d?q=80&w=925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        inverse: false
    },
    {
        id: "02",
        title: "Gestão do Departamento Jurídico",
        slug: "direito-tributario",
        desc: "Desenvolva visão estratégica sobre gestão jurídica corporativa, liderança, eficiência operacional, uso de tecnologia e inteligência artificial, governança e atuação do jurídico como agente de decisão dentro das organizações.",
        // Imagem nova: Reunião executiva moderna e de alto padrão
        image: "https://images.unsplash.com/39/lIZrwvbeRuuzqOoWJUEn_Photoaday_CSD%20%281%20of%201%29-5.jpg?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        inverse: true
    }
];

export default function EducacaoExecutiva() {
    // Número do WhatsApp de atendimento (Coloque o DDI + DDD + Número)
    // Exemplo: 55 (Brasil) + 21 (DDD) + 999999999
    const WHATSAPP_NUMBER = "5521951114003";

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
                    {PROGRAMAS.map((programa) => {
                        // Cria a mensagem personalizada dinamicamente baseada no título do card
                        const mensagem = `Olá! Gostaria de conhecer mais sobre os programas executivos, em especial: ${programa.title}.`;
                        const linkWhatsapp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

                        return (
                            <motion.div
                                key={programa.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                //@ts-ignore 
                                variants={programa.inverse ? slideInRight : slideInLeft}
                                className={`flex flex-col md:flex-row bg-[#e4e0e0] rounded-2xl overflow-hidden group hover:shadow-2xl transition-shadow duration-500 md:h-[280px]`}
                            >
                                {/* --- CAIXA DA IMAGEM --- */}
                                <div className={`w-full md:w-1/2 h-56 md:h-full overflow-hidden ${programa.inverse ? 'md:order-2' : 'md:order-1'}`}>
                                    <img
                                        src={programa.image}
                                        alt={programa.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* --- CAIXA DE TEXTO --- */}
                                <div className={`w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center text-center ${programa.inverse ? 'md:order-1' : 'md:order-2'}`}>
                                    <h3 className="text-xl md:text-2xl font-bold text-[#3A3833] mb-3">
                                        {programa.title}
                                    </h3>

                                    <p className="text-[#4A4740] text-sm leading-relaxed mb-5 max-w-sm line-clamp-3">
                                        {programa.desc}
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