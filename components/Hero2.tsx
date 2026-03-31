"use client";
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export default function Hero() {
    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            // Alterado justify-center para justificar o conteúdo à esquerda e alinhá-lo verticalmente
            className="w-full min-h-screen flex items-center bg-black bg-cover bg-center bg-no-repeat pt-20"
            style={{
                // Overlay sólido e mais escuro (60% preto constante) para garantir a leitura igual ao Figma
                backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/Imagem_1.jpg')"
            }}
        >
            {/* max-w-7xl para alinhar com o header e text-left para encostar na esquerda */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">

                {/* O bloco principal do texto limitado a max-w-2xl para não esticar até ao fim do ecrã */}
                <div className="max-w-2xl">
                    <motion.h1
                        variants={fadeInUp}
                        // Título branco, fonte um pouco mais limpa sem o gradiente
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-8"
                    >
                        IAE: Conectando <br />
                        a técnica jurídica <br />
                        à realidade <br />
                        corporativa.
                    </motion.h1>

                    {/* Linha separadora horizontal (HR) fina e semi-transparente como no Figma */}
                    <motion.div variants={fadeInUp} className="w-full h-[1px] bg-white/30 mb-8"></motion.div>

                    {/* Bloco flex para alinhar o parágrafo de texto e o botão lado a lado em ecrãs maiores */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <motion.p
                            variants={fadeInUp}
                            // Texto cinza claro, tamanho menor que o anterior
                            className="text-base md:text-lg text-gray-300 leading-relaxed max-w-md"
                        >
                            Programas executivos conduzidos por profissionais com ampla experiência de mercado. Conhecimento jurídico aplicado aos desafios reais das organizações.
                        </motion.p>

                        <motion.div variants={fadeInUp}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                // Botão quadrado e branco com texto preto, bem minimalista
                                className="bg-white hover:bg-gray-100 text-black px-6 py-3 font-bold text-xs tracking-widest uppercase transition-all shadow-lg"
                            >
                                Saiba Mais +
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}