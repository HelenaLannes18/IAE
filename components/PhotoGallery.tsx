"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, zoomIn } from '@/lib/animations';

// Mock fixo com as postagens reais do IAE
const MOCK_IG_POSTS = [
    {
        id: '1',
        media_url: '/post1.png', // Caminho da imagem na pasta public
        permalink: 'https://www.instagram.com/p/DOlp2jnkSMl/' // Link real do print
    },
    {
        id: '2',
        media_url: '/post2.png', // Caminho da imagem na pasta public
        permalink: 'https://www.instagram.com/p/DOlpT0KEV_z/' // Link real do print
    }
];

export default function PhotoGallery() {
    // Como estamos usando dados estáticos por enquanto, removemos o useEffect que chamava a API
    const posts = MOCK_IG_POSTS;

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="py-16 px-4 max-w-7xl mx-auto overflow-hidden"
        >
            {/* Grid adaptado para ficar elegante com apenas 2 posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {posts.map((post) => (
                    <motion.a
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        // @ts-ignore
                        variants={zoomIn}
                        className="bg-black rounded-[2rem] overflow-hidden relative group cursor-pointer block aspect-square shadow-2xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            style={{ backgroundImage: `url(${post.media_url})` }}
                        />

                        {/* Overlay escuro com ícone do Instagram no hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                            <svg className="w-12 h-12 text-white drop-shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}