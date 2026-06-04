"use client";
import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '@/lib/animations';

export default function IfYouToGet() {
    return (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="py-24 px-4 bg-gray-50 rounded-[3rem] mx-4 md:mx-10 mb-24">

            {/* Título da Seção */}
            <div className="max-w-6xl mx-auto text-center mb-16 md:mb-20">
                <motion.h2
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
                >
                    CONHEÇA OS <br />
                    PROGRAMAS EXECUTIVOS
                </motion.h2>
            </div>

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
                {/* @ts-ignore */}
                <motion.div variants={slideInLeft}>
                    <h2 className="text-5xl md:text-6xl font-bold mb-10 text-gray-900">Diferenciais</h2>
                    <ul className="space-y-8 text-xl text-gray-600">
                        {['Professores com atuação executiva no mercado', 'Conteúdo aplicado à realidade das organizações', 'Networking qualificado entre profissionais', 'Discussão de casos e desafios reais'].map((text, i) => (
                            <motion.li key={i} whileHover={{ x: 10 }} className="flex gap-6 items-start">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-white-500 flex items-center justify-center font-bold">✓</span>
                                <span>{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
                {/* @ts-ignore */}
                <motion.div variants={slideInRight}>
                    <h2 className="text-5xl md:text-6xl font-bold mb-10 text-gray-300">Experiência IAE</h2>
                    <ul className="space-y-8 text-xl text-gray-600">
                        {['Turmas reduzidas e ambiente executivo', 'Formação orientada à tomada de decisão', 'Integração entre técnica jurídica e negócios', 'Programas presenciais com dinâmica prática'].map((text, i) => (
                            <motion.li key={i} whileHover={{ x: 10 }} className="flex gap-6 items-start">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">→</span>
                                <span>{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.section>
    );
}