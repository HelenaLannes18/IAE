'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxImage({ src, alt }: { src: string, alt: string }) {
    const containerRef = useRef(null);

    // Captura o scroll do usuário em relação a este container específico
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Transforma o scroll em um movimento no eixo Y (de -15% a 15%)
    const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl">
            <motion.img
                style={{ y, scale: 1.15 }} // O scale 1.15 garante que a imagem não mostre bordas brancas ao se mover
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
}