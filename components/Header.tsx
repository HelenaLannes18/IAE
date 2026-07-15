"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Adicionado para checar a rota atual

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname(); // Pega a URL atual

    const navItems = [
        { label: 'Home', href: '/' },
        // { label: 'Sobre', href: '/sobre' },
        { label: 'Quem Somos', href: '/#quem-somos' },
        { label: 'Programas Executivos', href: '/#programas-executivos' },
        // { label: 'Noticias', href: '/#noticias' },
        { label: 'Contato', href: '/#contato' }
    ];

    // Função inteligente para lidar com os cliques e o scroll suave
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // 1. Sempre fecha o menu mobile ao clicar
        setIsMobileMenuOpen(false);

        // 2. Verifica se é um link de âncora (hash)
        if (href.startsWith('/#')) {
            const targetId = href.replace('/#', '');
            const elem = document.getElementById(targetId);

            // 3. Se já estamos na Home, intercepta o clique e faz o scroll manual
            if (pathname === '/') {
                if (elem) {
                    e.preventDefault(); // Impede o pulo brusco padrão do HTML

                    const headerHeight = 80; // Altura do seu header (h-20 = 80px)
                    const elementPosition = elem.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Atualiza a URL sem causar um pulo na tela
                    window.history.pushState(null, '', `/#${targetId}`);
                }
            }
            // Se NÃO estivermos na Home, o Next.js vai carregar a Home naturalmente e pular para a ID.
        }
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* --- LOGO IAE --- */}
                    <div className="flex items-center cursor-pointer z-50">
                        <Link href="/" onClick={(e) => handleNavClick(e, '/')}>
                            <img
                                src="/logo.png"
                                alt="Logo IAE"
                                className="h-16 md:h-20 w-auto object-contain py-2 mix-blend-multiply"
                            />
                        </Link>
                    </div>

                    {/* --- MENU DE NAVEGAÇÃO DESKTOP --- */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* --- BOTÃO HAMBÚRGUER MOBILE --- */}
                    <div className="md:hidden flex items-center z-50">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-600 hover:text-amber-600 focus:outline-none p-2"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MENU DROPDOWN MOBILE --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-lg absolute w-full top-20 left-0"
                    >
                        <nav className="flex flex-col px-4 pt-2 pb-6 space-y-4 shadow-inner">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className="block text-gray-700 hover:text-amber-600 font-medium text-lg border-b border-gray-50 pb-2 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}