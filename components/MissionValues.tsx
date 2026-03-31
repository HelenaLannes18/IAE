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
            <motion.div variants={slideInLeft} className="grid md:grid-cols-12 gap-8 mb-20 items-center">
                <h2 className="md:col-span-4 text-5xl md:text-6xl font-bold text-[#C7BFB3]">
                    Missão
                </h2>
                <p className="md:col-span-8 text-3xl md:text-4xl font-bold leading-tight text-[#16243A]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
                </p>
            </motion.div>

            {/* Bloco dos Valores */}
            <motion.div variants={slideInRight} className="grid md:grid-cols-12 gap-8 mb-16 items-center">
                <h2 className="md:col-span-4 text-5xl md:text-6xl font-bold text-[#C7BFB3]">
                    Valores
                </h2>
                <p className="md:col-span-8 text-xl md:text-2xl text-[#3A3733] leading-relaxed border-l-4 border-[#16243A] pl-6">
                    Lorem ipsum dolor sit amet, <span className="text-[#16243A] font-bold">consectetur adipiscing elit</span>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
            </motion.div>
        </motion.section>
    );
}