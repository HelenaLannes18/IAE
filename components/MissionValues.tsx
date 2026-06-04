"use client";
import { motion } from 'framer-motion';
import { staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';

export default function MissionValues() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="py-24 max-w-7xl mx-auto px-4"
        >
            {/* Bloco da Missão */}
            {/* @ts-ignore */}
            <motion.div variants={slideInLeft} className="grid md:grid-cols-12 gap-8 mb-20 items-center">
                <h2 className="md:col-span-4 text-5xl md:text-6xl font-bold text-[#C7BFB3]">
                    Missão
                </h2>
                <p className="md:col-span-8 text-3xl md:text-4xl font-bold leading-tight text-[#16243A]">
                    Formar profissionais preparados para atuar nos desafios reais das organizações, conectando técnica jurídica, visão de negócios e capacidade de tomada de decisão no ambiente empresarial.
                </p>
            </motion.div>

            {/* Bloco dos Valores */}
            {/* @ts-ignore */}
            <motion.div variants={slideInRight} className="grid md:grid-cols-12 gap-8 mb-16 items-center">
                <h2 className="md:col-span-4 text-5xl md:text-6xl font-bold text-[#C7BFB3]">
                    Valores
                </h2>
                <p className="md:col-span-8 text-xl md:text-2xl text-[#3A3733] leading-relaxed border-l-4 border-[#16243A] pl-6">
                    O IAE acredita em uma formação jurídica conectada à prática, à excelência técnica e à realidade das empresas. Valorizamos ética, pensamento estratégico, protagonismo profissional e a construção de soluções aplicáveis aos desafios contemporâneos do mercado.
                </p>
            </motion.div>
        </motion.section>
    );
}