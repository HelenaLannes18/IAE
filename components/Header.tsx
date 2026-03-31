"use client";
import { motion } from 'framer-motion';

export default function Header() {
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
                        <img
                            src="/logo_2.jpeg"
                            alt="Logo IAE"
                            // h-16 a h-20 é o tamanho ideal para caber no menu sem estourar a barra
                            className="h-16 md:h-20 w-auto object-contain py-2"
                        />
                    </div>

                    {/* --- MENU DE NAVEGAÇÃO --- */}
                    <nav className="hidden md:flex space-x-8">
                        {['Home', 'Quem Somos', 'Programas Executivos', 'Blog', 'Contato'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-gray-600 hover:text-amber-600 font-medium transition-colors relative group"
                            >
                                {item}
                                {/* Linha dourada que cresce ao passar o mouse */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                </div>
            </div>
        </motion.header>
    );
}