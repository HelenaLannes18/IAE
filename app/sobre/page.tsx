"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MissionValues from '@/components/MissionValues';

// Variantes de animação
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Dados da página "Quem Somos"
const ABOUT_SECTIONS = [
    {
        id: 1,
        number: "",
        title: "Missão", // <-- Título alterado aqui
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600",
        text: "Nascemos da necessidade de aproximar a teoria jurídica da realidade dinâmica das grandes corporações. Nosso foco é traduzir a complexidade regulatória em estratégias acionáveis que impulsionam os negócios de forma segura e ética."
    },
    {
        id: 2,
        number: "",
        title: "A Metodologia",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600",
        text: "Nossos programas fogem do tradicionalismo engessado. Utilizamos estudos de caso reais, simulações de comitês executivos e debates orientados a problemas (Problem-Based Learning) para garantir que o aprendizado seja aplicável já no dia seguinte."
    },
    {
        id: 3,
        number: "",
        title: "Corpo Docente",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1600",
        text: "Não somos apenas teóricos. Nossos professores são líderes de mercado — diretores jurídicos, sócios de grandes bancas e executivos de compliance — que vivenciam diariamente os desafios que ensinam em sala de aula."
    },
    {
        id: 4,
        number: "",
        title: "Visão de Futuro",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600",
        text: "Acreditamos que o advogado do futuro não é apenas um consultor técnico, mas um parceiro de negócios estratégico. Trabalhamos para formar profissionais capazes de liderar a inovação dentro de seus departamentos e empresas."
    }
];

export default function QuemSomosPage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-gray-300">
            <Header />

            <main>
                {/* HERO SECTION */}
                <section className="bg-[#111111] text-white pt-40 pb-24 md:pt-56 md:pb-32 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter max-w-4xl uppercase"
                        >
                            Visão geral do <br className="hidden md:block" />
                            nosso instituto
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-gray-400 text-lg md:text-xl max-w-sm mb-2"
                        >
                            Conceitos criados para atingir uma formação executiva que vai além das suas aspirações.
                        </motion.p>
                    </div>
                </section>

                <MissionValues />

                {/* SEÇÕES DE CONTEÚDO (O "Efeito de Passada") */}
                <div className="relative">
                    {ABOUT_SECTIONS.map((section, index) => (
                        <section
                            key={section.id}
                            style={{ zIndex: index * 10 }} // Fixado o z-index para garantir funcionamento em JIT
                            className={`sticky top-0 w-full min-h-screen flex flex-col justify-center border-t border-slate-200/50 overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.03)] ${index % 2 === 0 ? 'bg-white' : 'bg-[#F4F4F4]'
                                }`}
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-24">

                                {/* NOVO LAYOUT: Flexbox (Imagem na Esquerda, Texto na Direita) */}
                                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">

                                    {/* LADO ESQUERDO: Imagem e Título Mobile */}
                                    <div className="w-full lg:w-5/12 relative group shrink-0">

                                        {/* Título - Aparece APENAS no mobile em cima da imagem */}
                                        <motion.h2
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-50px" }}
                                            //@ts-ignore
                                            variants={fadeInUp}
                                            className="lg:hidden text-4xl sm:text-5xl font-extrabold uppercase text-slate-900 mb-6 tracking-tight"
                                        >
                                            {section.title}
                                        </motion.h2>

                                        {/* Container da Imagem Menor e Arredondada */}
                                        <div className="w-full sm:w-[85%] lg:w-full aspect-[4/3] md:aspect-[16/10] bg-gray-200 overflow-hidden rounded-2xl relative mx-auto lg:mx-0 shadow-lg">
                                            <motion.div
                                                initial={{ width: "100%" }}
                                                whileInView={{ width: "0%" }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
                                                className="absolute top-0 right-0 bottom-0 bg-slate-900 z-10"
                                            />
                                            <img
                                                src={section.image}
                                                alt={section.title}
                                                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                                            />
                                        </div>
                                    </div>

                                    {/* LADO DIREITO: Título Desktop e Texto */}
                                    <div className="w-full lg:w-7/12 flex flex-col justify-center">

                                        {/* Título - Aparece APENAS no Desktop */}
                                        <motion.h2
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-50px" }}
                                            //@ts-ignore
                                            variants={fadeInUp}
                                            className="hidden lg:block text-5xl xl:text-6xl font-extrabold uppercase text-slate-900 mb-8 tracking-tight"
                                        >
                                            {section.title}
                                        </motion.h2>

                                        {/* Texto com max-w-xl para evitar linhas extremamente longas */}
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-50px" }}
                                            //@ts-ignore
                                            variants={fadeInUp}
                                            className="max-w-xl"
                                        >
                                            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
                                                {section.text}
                                            </p>
                                        </motion.div>
                                    </div>

                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* CALL TO ACTION */}
                <section className="bg-white py-32 px-4 text-center relative z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto flex flex-col items-center"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                            Pronto para evoluir a sua carreira corporativa?
                        </h2>
                        <button className="bg-black hover:bg-neutral-800 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-[0.2em] transition-all transform hover:scale-105">
                            Fale conosco
                        </button>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
}