"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicationForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (!formData.name || !formData.email) {
            setFeedback({ type: 'error', message: 'Preencha ao menos nome e e-mail.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setFeedback({ type: 'success', message: 'Recebemos seu contato! Em breve nossa equipe falará com você.' });
                setFormData({ name: '', email: '', phone: '', course: '' });
            } else {
                setFeedback({ type: 'error', message: data.error || 'Não foi possível enviar. Tente novamente.' });
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            setFeedback({ type: 'error', message: 'Erro de conexão. Verifique sua internet e tente novamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 bg-black px-4 text-white relative"
        >
            <div id="contato" className="max-w-5xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* --- Lado Esquerdo: Textos --- */}
                <div>
                    <h2 className="text-5xl md:text-7xl font-regular mb-6 leading-tight text-white">
                        Fale <br />
                        <span className="text-white font-bold">Conosco</span>
                    </h2>

                    <p className="text-xl text-white mb-8 leading-relaxed max-w-sm">
                        Entre em contato para conhecer os programas do IAE, esclarecer dúvidas e entender como nossa formação executiva pode contribuir para sua trajetória profissional.
                    </p>

                    <div className="w-20 h-1.5 bg-white rounded-full mt-10 opacity-50"></div>
                </div>

                {/* --- Lado Direito: Formulário --- */}
                <div className="bg-[#F3F1EC] rounded-3xl p-8 md:p-10 shadow-2xl text-[#3A3733]">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-5">

                            <div className="col-span-2">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Nome"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186] disabled:opacity-60"
                                />
                            </div>

                            <div className="col-span-2">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    disabled={isSubmitting}
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186] disabled:opacity-60"
                                />
                            </div>

                            <div className="col-span-2">
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Telefone"
                                    disabled={isSubmitting}
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186] disabled:opacity-60"
                                />
                            </div>

                            {/* --- SELECT DE CURSOS --- */}
                            <div className="col-span-2 relative">
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#9A9186] appearance-none cursor-pointer disabled:opacity-60"
                                >
                                    <option value="" disabled className="text-[#9A9186]">Selecione o programa de interesse</option>
                                    <option value="direito-regulatorio" className="text-[#3A3733]">Direito Regulatório</option>
                                    <option value="gestao-juridica" className="text-[#3A3733]">Gestão do Departamento Jurídico</option>
                                    <option value="compliance" className="text-[#3A3733]">Compliance e Governança</option>
                                    <option value="inovacao" className="text-[#3A3733]">Inovação e Tecnologia Jurídica</option>
                                </select>
                                {/* Pequena seta customizada */}
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#9A9186]">
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor">
                                        <path d="M1 1.5L6 6.5L11 1.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                        </div>

                        <AnimatePresence mode="wait">
                            {feedback && (
                                <motion.p
                                    key={feedback.message}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`text-sm font-semibold px-1 ${feedback.type === 'success' ? 'text-green-700' : 'text-red-600'}`}
                                >
                                    {feedback.message}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-black/20 transition-all tracking-wider uppercase text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Enviando...' : 'Tenho interesse'}
                        </motion.button>
                    </form>
                </div>

            </div>
        </motion.section>
    );
}