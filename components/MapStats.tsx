"use client";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { staggerContainer, zoomIn, fadeInUp, floating } from '@/lib/animations';

export default function MapStats() {
    return (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="py-24 bg-gray-50 text-center rounded-[3rem] mx-4 md:mx-10 mb-24 shadow-sm border border-gray-100 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <motion.h2 variants={zoomIn} className="text-7xl md:text-[10rem] font-extrabold text-gray-900 tracking-tighter mb-4 leading-none">
                    <CountUp end={10} duration={2} enableScrollSpy scrollSpyOnce /> <span className="text-4xl md:text-8xl">countries</span>
                </motion.h2>
                <motion.div variants={fadeInUp} className="relative w-full h-[300px] md:h-[600px] mt-12 mb-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain opacity-20 pointer-events-none"></div>
                    <motion.div animate={floating} className="absolute top-1/4 left-1/4 bg-orange-500 text-white font-bold py-3 px-5 rounded-full text-xl shadow-xl shadow-orange-500/40 backdrop-blur-sm">
                        <CountUp end={15} enableScrollSpy scrollSpyOnce />
                    </motion.div>
                    <motion.div animate={floating} style={{ animationDelay: '0.5s' }} className="absolute top-1/2 left-1/2 bg-orange-500 text-white font-bold py-4 px-6 rounded-full text-2xl shadow-xl shadow-orange-500/40">
                        <CountUp end={67} enableScrollSpy scrollSpyOnce />
                    </motion.div>
                    <motion.div animate={floating} style={{ animationDelay: '1s' }} className="absolute top-1/3 right-1/4 bg-orange-500 text-white font-bold py-5 px-8 rounded-full text-4xl shadow-xl shadow-orange-500/40">
                        <CountUp end={966} enableScrollSpy scrollSpyOnce />
                    </motion.div>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-2xl md:text-4xl text-gray-600 font-medium max-w-4xl mx-auto leading-tight">
                    Entrepreneurs across all industries and market niches, united by shared values.
                </motion.p>
            </div>
        </motion.section>
    );
}