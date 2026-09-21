"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, zoomIn } from '@/lib/animations';

interface InstagramPost {
    id: string;
    media_url: string;
    permalink: string;
    media_type?: string;
    username?: string;
    caption?: string;
}

const FALLBACK_IG_POSTS: InstagramPost[] = [
    {
        id: '1',
        media_url: '/post1.png',
        permalink: 'https://www.instagram.com/p/DOlp2jnkSMl/'
    },
    {
        id: '2',
        media_url: '/post2.png',
        permalink: 'https://www.instagram.com/p/DOlpT0KEV_z/'
    }
];

const MAX_POSTS = 8;

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

export default function PhotoGallery() {
    const [posts, setPosts] = React.useState<InstagramPost[]>(FALLBACK_IG_POSTS);

    React.useEffect(() => {
        let cancelled = false;

        async function loadPosts() {
            try {
                const res = await fetch('/api/instagram');
                const json = await res.json();

                if (!cancelled && Array.isArray(json.data) && json.data.length > 0) {
                    setPosts(json.data.slice(0, MAX_POSTS));
                }
            } catch (error) {
                console.error('Erro ao carregar posts do Instagram:', error);
            }
        }

        loadPosts();

        return () => {
            cancelled = true;
        };
    }, []);

    const username = posts.find((post) => post.username)?.username;

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="py-16 px-4 max-w-7xl mx-auto overflow-hidden"
        >
            {/* Cabeçalho com identidade da conta do Instagram */}
            <div className="flex flex-col items-center text-center mb-10 gap-3">
                <div className="flex items-center gap-2 text-[#3A3733]/70">
                    <InstagramIcon className="w-5 h-5" />
                    <span className="uppercase tracking-widest text-xs font-semibold">Instagram</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#16243A]">
                    Acompanhe o IAE por lá
                </h2>
                {username && (
                    <a
                        href={`https://www.instagram.com/${username}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#16243A]/70 hover:text-[#16243A] transition-colors underline underline-offset-4"
                    >
                        @{username}
                    </a>
                )}
            </div>

            {/* Grid com os últimos posts reais do Instagram */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 max-w-6xl mx-auto">
                {posts.map((post) => (
                    <motion.a
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={post.caption?.slice(0, 100)}
                        // @ts-ignore
                        variants={zoomIn}
                        className="bg-black rounded-2xl overflow-hidden relative group cursor-pointer block aspect-square shadow-xl"
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            style={{ backgroundImage: `url(${post.media_url})` }}
                        />

                        {/* Overlay escuro com ícone do Instagram no hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                            <InstagramIcon className="w-9 h-9 text-white drop-shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-500" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
}