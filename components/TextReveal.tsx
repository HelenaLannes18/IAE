'use client';

import { motion } from 'framer-motion';

export default function TextReveal({ text, delay = 0 }: { text: string, delay?: number }) {
    return (
        // O overflow-hidden aqui é o segredo. Ele cria a linha de corte.
        <div className="overflow-hidden inline-block align-bottom">
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                    duration: 0.8,
                    delay: delay,
                    ease: [0.33, 1, 0.68, 1] // Curva de aceleração estilo "Apple/Premium"
                }}
            >
                {text}
            </motion.div>
        </div>
    );
}