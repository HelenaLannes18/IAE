"use client";
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, zoomIn } from '@/lib/animations';

export default function EventsFormats() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="py-32 text-center px-4"
        >
            <motion.h2
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-extrabold text-[#16243A] max-w-5xl mx-auto leading-tight tracking-tight mb-8"
            >
                <span className="text-[#9A9186]">Lorem</span> ipsum dolor sit amet <span className="text-[#9A9186]">consectetur</span> adipiscing elit
            </motion.h2>

            <motion.p
                variants={fadeInUp}
                className="text-2xl text-[#3A3733]/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, excepteur sint occaecat.
            </motion.p>

            <motion.div variants={zoomIn}>
                <button
                    className="border-2 border-[#16243A] text-[#16243A] hover:bg-[#16243A] hover:text-[#F3F1EC] px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-[#16243A]/10"
                >
                    Explorar Formatos
                </button>
            </motion.div>
        </motion.section>
    );
}