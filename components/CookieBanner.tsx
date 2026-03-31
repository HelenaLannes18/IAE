"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (accepted: boolean) => {
        localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    className="fixed bottom-0 left-0 w-full bg-[#131d2f] text-white z-[100] border-t border-blue-900/50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
                >
                    <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-5 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed uppercase tracking-wider text-justify lg:text-left flex-1 max-w-5xl">
                            Ao clicar em "Aceitar todos os cookies", você concorda que os cookies sejam armazenados em seu dispositivo para melhorar a navegação no site.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                            <button onClick={() => handleConsent(true)} className="bg-[#f8f9fa] text-[#131d2f] px-6 py-2.5 text-xs font-bold hover:bg-white transition-colors uppercase tracking-wider">
                                Aceitar os Cookies
                            </button>
                            <button onClick={() => handleConsent(false)} className="bg-[#f8f9fa] text-[#131d2f] px-6 py-2.5 text-xs font-bold hover:bg-white transition-colors uppercase tracking-wider">
                                Rejeitar os Cookies
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}