"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

// Dados dos professores
const CORPO_DOCENTE = [
    {
        id: 1,
        name: "Guga Costa",
        role: "Presidente",
        image: "/guga.JPG",
        bio: "Presidente e Professor do IAE, é Mestre em Direito da Regulação pela FGV, pós-graduado em Direito Empresarial pelo Ibmec. Sob sua liderança, o departamento jurídico da White Martins foi reconhecido como o melhor do setor químico e petroquímico em 2024."
    },
    {
        id: 2,
        name: "Rodrigo Gadben",
        role: "Coordenador",
        image: "/rodrigo.jpg",
        bio: "Coordenador Acadêmico e Professor do IAE, é Mestre e Doutorando em Direito da Regulação pela FGV, além de ser professor da pós-graduação e graduação da FGV Direito Rio de Janeiro. Rodrigo foi procurador de diversos municípios do Estado de Minas Gerais."
    },
    {
        id: 3,
        name: "Daniela Vilhena",
        role: "Professora",
        image: "/daniela.jpg",
        bio: "Sócia do escritório de advocacia Castro Barros Advogados. Daniela foi Head of Legal and Compliance na Souza Cruz (BAT Brasil), e Diretora Jurídica, Regulatória e de Compliance na Winity, além de exercer a função de Árbitra no CBMA."
    },
    {
        id: 4,
        name: "José G. Costa",
        role: "Professor",
        image: "/jose.JPG",
        bio: "Diretor Jurídico Tributário Corporativo da Vibra Energia, Mestre em Finanças Públicas pela UERJ, Pósgraduado em Direito Tributário pela Candido Mendes, Membro da CEAT da OAB/RJ, da ABDF e do GDT-Rio, Coordenador Técnico do Fórum Carioca de Tax e Compliance, Professor do LLM em Direito Tributário da Mackenzie, do IBMEC e da PUC-Campinas, além de ser Coordenador e coautor de diversas obras jurídicas literárias."
    },
    {
        id: 5,
        name: "Vinicius Lannes",
        role: "Especialista",
        image: "/vini.jpg",
        bio: "Pós-graduado em Direito Corporativo pelo Ibmec. Diretor jurídico da Aport Educacional, BS School of Biomedicine e Centro Médico e Odontológico CADEG. Vinicius acumula experiências em grandes escritórios de advocacia e empresas multinacionais."
    },
    // {
    //     id: 6,
    //     name: "Ana Lima",
    //     role: "Especialista",
    //     image: "/ana.jpg",
    //     bio: "Sócio M&A. Atuou em fusões de grande porte no cenário nacional."
    // }
];

// --- SUBCONPONENTE DA CARTA ---
// @ts-ignore
function MentorCard({ prof }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            variants={fadeInUp}
            className="group relative aspect-[3/4] cursor-pointer [perspective:1000px]"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div
                className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] shadow-lg hover:shadow-xl rounded-2xl ${isFlipped ? '[transform:rotateY(180deg)]' : 'lg:group-hover:[transform:rotateY(180deg)]'}`}
            >
                {/* --- FRENTE DO CARD --- */}
                <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden [backface-visibility:hidden]">

                    {/* Tag Interativa - Muda de acordo com a tela */}
                    <div className="absolute top-3 left-3 bg-[#C7BFB3]/90 backdrop-blur-sm text-[#16243A] text-[9px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full z-10 shadow-md">
                        <span className="lg:hidden">Clique aqui</span>
                        <span className="hidden lg:inline">Passe o mouse</span>
                    </div>

                    <img
                        src={prof.image}
                        alt={prof.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Gradiente e Textos Reduzidos */}
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-[#16243A] via-[#16243A]/80 to-transparent">
                        <h3 className="text-[#F3F1EC] font-bold text-base leading-tight">{prof.name}</h3>
                        <p className="text-[#C7BFB3] text-[11px] mt-0.5 font-semibold">{prof.role}</p>
                    </div>
                </div>

                {/* --- PARTE DE TRÁS DO CARD --- */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-[#16243A] p-4 text-center text-[#F3F1EC] [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center items-center border border-[#C7BFB3]/30">
                    <h3 className="text-[#F3F1EC] font-bold text-base mb-1">{prof.name}</h3>
                    <div className="w-8 h-0.5 bg-[#C7BFB3] rounded-full mb-3 shrink-0"></div>

                    {/* Texto com overflow-y-auto para biografias muito longas */}
                    <div className="overflow-y-auto max-h-[75%] pr-1 w-full text-left scrollbar-thin scrollbar-thumb-[#C7BFB3] scrollbar-track-transparent">
                        <p className="text-[10px] leading-relaxed text-[#F3F1EC]/90">
                            {prof.bio}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// --- COMPONENTE PRINCIPAL ---
export default function MentorsGrid() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto px-4 mb-32"
        >
            <motion.div variants={fadeInUp} className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#16243A] tracking-tight">
                    Aprenda com os líderes do mercado
                </h2>

            </motion.div>

            {/* Grid configurado para 5 colunas na mesma linha no PC (lg:grid-cols-5) e 2 no celular */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 justify-center">
                {CORPO_DOCENTE.map((prof) => (
                    <MentorCard key={prof.id} prof={prof} />
                ))}
            </div>
        </motion.section>
    );
}