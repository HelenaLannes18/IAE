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
            {/* O QUE MUDOU: 
              - Trocamos o `aspect-video` forçado por um `min-h-[60vh]` no mobile, voltando a `md:aspect-video` no desktop.
              - Reduzimos o border-radius no mobile (`rounded-3xl`) e voltamos ao original no desktop (`md:rounded-[3rem]`).
            */}
            <div className="relative w-full min-h-[60vh] md:min-h-0 md:aspect-video bg-[#16243A] rounded-3xl md:rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl border border-[#C7BFB3]/20">

                {/* O QUE MUDOU: 
                  - No mobile, o gradiente vem de baixo para cima (`bg-gradient-to-t`) para proteger o texto. No desktop, volta a ser lateral (`md:bg-gradient-to-r`).
                */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#16243A]/90 via-[#16243A]/70 md:via-[#16243A]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-80"></div>

                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1920')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"></div>

                {/* O QUE MUDOU: 
                  - Redução de padding (`p-6` no mobile, `md:p-20` no desktop).
                  - Mudança de alinhamento: Centralizado no bottom no mobile (`justify-end items-center text-center`), e lateral no desktop (`md:justify-center md:items-start md:text-left`).
                */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end md:justify-center items-center md:items-start p-6 sm:p-10 md:p-20 z-20 pb-12 md:pb-20 text-center md:text-left">

                    {/* O QUE MUDOU: Tamanho da fonte reduzido para text-3xl no celular */}
                    <h2 className="text-[#F3F1EC] text-3xl sm:text-4xl md:text-7xl font-bold max-w-4xl mb-8 md:mb-10 leading-tight drop-shadow-lg">
                        IAE, escola do advogado in-house. Onde a teoria encontra a prática.
                    </h2>

                    {/* O QUE MUDOU: Tamanho do botão e do ícone reduzidos no celular */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 bg-[#F3F1EC] hover:bg-[#C7BFB3] transition-colors rounded-full flex items-center justify-center text-[#16243A] shadow-2xl shadow-[#16243A]/50 shrink-0"
                    >
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 ml-1 md:ml-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </motion.div>
                </div>

            </div>
        </motion.section>
    );
}