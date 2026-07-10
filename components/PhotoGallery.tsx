"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, zoomIn } from '@/lib/animations';

// Mock simulando o retorno da API do Instagram. 
// Isso garante que a tela não quebre enquanto você não liga o backend.
const MOCK_IG_POSTS = [
    { id: '1', media_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1600', permalink: 'https://instagram.com' },
    { id: '2', media_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800', permalink: 'https://instagram.com' },
    { id: '3', media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=500', permalink: 'https://instagram.com' },
    { id: '4', media_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800', permalink: 'https://instagram.com' }
];

export default function PhotoGallery() {
    const [posts, setPosts] = useState(MOCK_IG_POSTS);

    /*
    ========================================================================
    INTEGRAÇÃO COM A API (Descomente quando tiver seu endpoint pronto)
    ========================================================================
    useEffect(() => {
        const fetchInstagramPosts = async () => {
            try {
                // Rota da sua API no Next.js que se comunica com a API Graph do Instagram
                const res = await fetch('/api/instagram');
                const data = await res.json();
                
                if (data && data.data) {
                    // Pegamos apenas os 4 últimos posts para manter o design do seu grid
                    setPosts(data.data.slice(0, 4));
                }
            } catch (error) {
                console.error("Erro ao buscar posts do Instagram:", error);
            }
        };
        fetchInstagramPosts();
    }, []);
    ========================================================================
    */

    // Função para manter o seu layout original assimétrico do grid
    const getGridClass = (index: number) => {
        switch (index) {
            case 0: return "col-span-2 row-span-2"; // Post maior (Destaque)
            case 1: return "";                      // Post menor
            case 2: return "";                      // Post menor
            case 3: return "col-span-2";            // Post horizontal embaixo
            default: return "";
        }
    };

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="py-12 px-4 max-w-7xl mx-auto overflow-hidden"
        >
            <div className="quem-somos grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px] md:h-[600px]">
                {posts.slice(0, 4).map((post, index) => (
                    <motion.a
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        // @ts-ignore
                        variants={zoomIn}
                        className={`${getGridClass(index)} bg-gray-200 rounded-3xl overflow-hidden relative group cursor-pointer block`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                            style={{ backgroundImage: `url(${post.media_url})` }}
                        >
                            {/* Overlay escuro com ícone do Instagram no hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                                <svg className="w-10 h-10 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}