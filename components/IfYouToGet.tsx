"use client";
import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '@/lib/animations';

export default function IfYouToGet() {
    return (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="py-24 px-4 bg-gray-50 rounded-[3rem] mx-4 md:mx-10 mb-24">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
                {/* @ts-ignore */}
                <motion.div variants={slideInLeft}>
                    <h2 className="text-5xl md:text-6xl font-bold mb-10 text-gray-900">Lorem</h2>
                    <ul className="space-y-8 text-xl text-gray-600">
                        {['Yeiusmod tempor incididunt', 'Yeiusmod tempor incididunt', 'Yeiusmod tempor incididunt'].map((text, i) => (
                            <motion.li key={i} whileHover={{ x: 10 }} className="flex gap-6 items-start">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-white-500 flex items-center justify-center font-bold">✓</span>
                                <span>{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
                {/* @ts-ignore */}
                <motion.div variants={slideInRight}>
                    <h2 className="text-5xl md:text-6xl font-bold mb-10 text-gray-300">Ipsum</h2>
                    <ul className="space-y-8 text-xl text-gray-600">
                        {['Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet'].map((text, i) => (
                            <motion.li key={i} whileHover={{ x: 10 }} className="flex gap-6 items-start">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold">→</span>
                                <span>{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </motion.section>
    );
}