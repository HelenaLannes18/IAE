"use client";
import { motion } from 'framer-motion';
import { zoomIn } from '@/lib/animations';

export default function VideoSection() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            //@ts-ignore 
            variants={zoomIn}
            className="py-12 px-4 max-w-7xl mx-auto"
        >
            {/* Fundo fallback Azul Profundo e borda sutil Greige */}
            <div className="relative w-full aspect-video bg-[#16243A] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl border border-[#C7BFB3]/20">

                {/* Gradiente Azul Profundo para garantir a leitura e aplicar a cor da marca sobre o vídeo/imagem */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#16243A]/90 via-[#16243A]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-80"></div>

                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1920')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>

                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center p-10 md:p-20 z-20">
                    {/* Texto Lorem Ipsum em Off-White */}
                    <h2 className="text-[#F3F1EC] text-4xl md:text-7xl font-bold max-w-2xl mb-8 leading-tight drop-shadow-lg">
                        Lorem ipsum dolor sit amet
                    </h2>

                    {/* Botão Play: Fundo Off-White, hover Greige e ícone Azul Profundo */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 md:w-28 md:h-28 bg-[#F3F1EC] hover:bg-[#C7BFB3] transition-colors rounded-full flex items-center justify-center text-[#16243A] shadow-2xl shadow-[#16243A]/50"
                    >
                        <svg className="w-10 h-10 md:w-14 md:h-14 ml-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </motion.div>
                </div>

            </div>
        </motion.section>
    );
}