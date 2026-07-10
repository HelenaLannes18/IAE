"use client";
import { motion } from 'framer-motion';
import Link from 'next/link'; // Importação obrigatória no Next.js

export default function Header() {
    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Sobre', href: '/sobre' },
        { label: 'Programas Executivos', href: '/#programas-executivos' },
        { label: 'Noticias', href: '/#noticias' },
        { label: 'Contato', href: '/#contato' }
    ];

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
                    <div className="flex items-center cursor-pointer">
                        {/* Trocado <a> por <Link> */}
                        <Link href="/">
                            <img
                                src="/logo.png"
                                alt="Logo IAE"
                                className="h-16 md:h-20 w-auto object-contain py-2 mix-blend-multiply"
                            />
                        </Link>
                    </div>

                    {/* --- MENU DE NAVEGAÇÃO --- */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            < Link
                                key={item.label}
                                href={item.href}
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors relative group"
                            >
                                {item.label}
                                {/* Linha dourada que cresce ao passar o mouse */}
                                < span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full" ></span>
                            </Link>
                        ))}
                    </nav>

                </div>
            </div >
        </motion.header >
    );
}