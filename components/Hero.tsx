"use client";
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, zoomIn } from '@/lib/animations';

export default function Hero() {
    return (
        <motion.section initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl mx-auto px-4 text-center mt-20 mb-28">
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                An international, welcoming community of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">entrepreneurs</span> committed to sustainable growth.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
                This is a genuinely warm and supportive business community where even in a new city you'll feel among "your people."
            </motion.p>
            <motion.div variants={zoomIn}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl shadow-orange-500/40 transition-all">
                    Join the Board
                </motion.button>
            </motion.div>
        </motion.section>
    );
}