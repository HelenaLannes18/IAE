"use client";
import { motion } from 'framer-motion';
import { staggerContainer, zoomIn } from '@/lib/animations';

export default function PhotoGallery() {
    return (
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="py-12 px-4 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px] md:h-[600px]">
                {/* @ts-ignore */}
                <motion.div variants={zoomIn} className="col-span-2 row-span-2 bg-gray-200 rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://plus.unsplash.com/premium_photo-1665203421659-09089ede4ffa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </motion.div>
                {/* @ts-ignore */}
                <motion.div variants={zoomIn} className="bg-gray-300 rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </motion.div>
                {/* @ts-ignore */}
                <motion.div variants={zoomIn} className="bg-gray-400 rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </motion.div>
                {/* @ts-ignore */}
                <motion.div variants={zoomIn} className="col-span-2 bg-gray-500 rounded-3xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                </motion.div>
            </div>
        </motion.section>
    );
}