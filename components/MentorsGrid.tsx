"use client";

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// Dados dos professores
const CORPO_DOCENTE = [
    {
        id: 1,
        name: "Guga Costa",
        role: "Presidente e Professor do IAE",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
        bio: "Mestre em Direito da Regulação pela FGV, pós-graduado em Direito Empresarial pelo Ibmec. Sob sua liderança, o depto jurídico da White Martins foi o melhor do setor em 2024."
    },
    {
        id: 2,
        name: "Rodrigo Gadben",
        role: "Coordenador Acadêmico",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800",
        bio: "Mestre e Doutorando em Direito da Regulação pela FGV. Professor da pós-graduação da FGV Direito Rio e procurador de diversos municípios de MG."
    },
    {
        id: 3,
        name: "Daniela Vilhena",
        role: "Professora do IAE",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800",
        bio: "Sócia do Castro Barros Advogados. Foi Head of Legal and Compliance na Souza Cruz (BAT Brasil), Diretora Jurídica na Winity e atua como Árbitra no CBMA."
    },
    {
        id: 4,
        name: "José G. Costa",
        role: "Professor do IAE",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800",
        bio: "Diretor Jurídico Tributário Corporativo da Vibra Energia. Mestre em Finanças Públicas, Professor do LLM em Direito Tributário do Mackenzie, IBMEC e PUC."
    }
];

export default function MentorsGrid() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-4 mb-32"
        >
            {/* Título Centralizado */}
            <motion.div variants={fadeInUp} className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#16243A] tracking-tight">
                    Corpo Docente
                </h2>
                <p className="mt-4 text-xl text-[#9A9186] max-w-2xl mx-auto">
                    Aprenda com líderes de mercado e profissionais de destaque.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CORPO_DOCENTE.map((prof) => (
                    // O [perspective:1000px] é fundamental para dar a ilusão de 3D ao virar a carta
                    <motion.div
                        key={prof.id}
                        variants={fadeInUp}
                        className="group relative aspect-[3/4] cursor-pointer [perspective:1000px]"
                    >
                        {/* Inner Container: Ele que faz o giro ao sofrer o hover da div "group" pai */}
                        <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-lg hover:shadow-xl rounded-3xl">

                            {/* --- FRENTE DO CARD --- */}
                            <div className="absolute inset-0 h-full w-full rounded-3xl overflow-hidden [backface-visibility:hidden]">
                                {/* Tag do Professor: Fundo Greige, texto Azul Profundo */}
                                <div className="absolute top-4 left-4 bg-[#C7BFB3] text-[#16243A] text-xs font-bold px-4 py-1.5 rounded-full z-10 shadow-md">
                                    IAE
                                </div>

                                {/* Imagem */}
                                <img
                                    src={prof.image}
                                    alt={prof.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Gradiente Escuro Embaixo usando o Azul Profundo para o nome aparecer bem */}
                                <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-[#16243A] via-[#16243A]/70 to-transparent">
                                    <h3 className="text-[#F3F1EC] font-bold text-2xl">{prof.name}</h3>
                                    <p className="text-[#C7BFB3] text-sm mt-1 font-semibold">{prof.role}</p>
                                </div>
                            </div>

                            {/* --- PARTE DE TRÁS DO CARD --- */}
                            {/* Fundo Azul Profundo, borda com transparência e textos em Off-White / Greige */}
                            <div className="absolute inset-0 h-full w-full rounded-3xl bg-[#16243A] px-6 py-8 text-center text-[#F3F1EC] [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center items-center border border-[#C7BFB3]/30">
                                <h3 className="text-[#F3F1EC] font-bold text-2xl mb-2">{prof.name}</h3>
                                {/* Linha decorativa Greige */}
                                <div className="w-12 h-1 bg-[#C7BFB3] rounded-full mb-6"></div>
                                <p className="text-sm md:text-base leading-relaxed text-[#F3F1EC]/90">
                                    {prof.bio}
                                </p>
                            </div>

                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}