"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        subject: 'Dúvida Geral',
        message: '',
        agreedToPrivacy: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        // Usa localStorage para garantir que a informação sobreviva a trocas de aba e navegação
        const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup_IAE');

        if (!hasSeenPopup) {
            // Grava IMEDIATAMENTE que o usuário já iniciou a visita. 
            // Se ele for para a página "Sobre" antes de dar 1.5s, quando voltar o popup não vai abrir.
            localStorage.setItem('hasSeenWelcomePopup_IAE', 'true');

            const timer = setTimeout(() => {
                setIsOpen(true);
                document.body.style.overflow = 'hidden';
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        if (!formData.email) {
            setFeedback({ type: 'error', message: 'Informe seu e-mail.' });
            return;
        }

        if (!formData.agreedToPrivacy) {
            setFeedback({ type: 'error', message: 'É necessário concordar com a política de privacidade.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    source: 'popup'
                })
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setFeedback({ type: 'success', message: 'Mensagem enviada! Em breve entraremos em contato.' });
                setFormData({ email: '', subject: 'Dúvida Geral', message: '', agreedToPrivacy: false });
                setTimeout(handleClose, 1800);
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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col md:flex-row w-full h-screen font-sans"
                >
                    {/* LADO ESQUERDO */}
                    <div className="hidden md:flex w-full md:w-[45%] bg-[#6B6B6B] relative flex-col justify-between p-8 lg:p-12 overflow-hidden text-black">

                        {/* Logo */}
                        <div>
                            <span className="text-xl font-bold tracking-tighter">IAE™</span>
                        </div>

                        {/* Menu Lateral */}
                        <div className="mt-8 z-10">
                            <h3 className="text-[10px] font-bold mb-4 uppercase tracking-widest opacity-80">Acesso Rápido</h3>
                            <ul className="space-y-2 text-sm font-medium">
                                <li className="hover:underline cursor-pointer w-fit">Programas Executivos</li>
                                <li className="hover:underline cursor-pointer w-fit">Quem Somos</li>
                                <li className="hover:underline cursor-pointer w-fit">Direito Regulatório</li>
                                <li className="hover:underline cursor-pointer w-fit">Gestão Jurídica</li>
                                <li className="hover:underline cursor-pointer w-fit">Corpo Docente</li>
                                <li className="hover:underline cursor-pointer w-fit">Notícias</li>
                            </ul>
                        </div>

                        {/* Texto Gigante no Fundo */}
                        <h1 className="text-[6rem] xl:text-[9rem] font-black leading-none absolute -bottom-6 xl:-bottom-8 -left-4 text-black opacity-90 tracking-tighter select-none pointer-events-none">
                            INSTITUTO
                        </h1>
                    </div>

                    {/* LADO DIREITO */}
                    <div className="w-full md:w-[55%] bg-[#EBEBEB] relative p-6 md:p-8 lg:p-12 flex flex-col h-full overflow-y-auto">

                        {/* Botão Fechar */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 md:top-8 md:right-8 text-[10px] font-bold uppercase tracking-widest hover:underline z-50 text-black"
                        >
                            Fechar
                        </button>

                        {/* Título Principal */}
                        <h1 className="text-5xl md:text-5xl lg:text-[5.5rem] font-black uppercase leading-[0.85] tracking-tighter text-black mt-10 md:mt-0 mb-8 lg:mb-12">
                            Conecte-se <br />
                            Com O IAE
                        </h1>

                        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 h-full">

                            {/* Coluna de Informações */}
                            <div className="w-full xl:w-5/12 flex flex-col gap-8 text-[10px] uppercase font-semibold tracking-widest text-black">
                                <div>
                                    <p className="mb-1 opacity-50">Contato</p>
                                    <a href="mailto:instituto.adv.empresarial@gmail.com" className="hover:underline text-xs">
                                        INSTITUTO.ADV.EMPRESARIAL ↗
                                    </a>
                                </div>
                                <div>
                                    <p className="mb-1 opacity-50">Socials</p>
                                    <p className="text-xs leading-relaxed">
                                        <a href="#" className="hover:underline">LinkedIn.</a> <br />
                                        <a href="/https://www.instagram.com/iae.educacao/" className="hover:underline">Instagram.</a>
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-1 opacity-50">Escritório IAE</p>
                                    {/* <p className="text-xs leading-relaxed">
                                        Rua Lorem Ipsum, 3400 <br />
                                        Centro, Rio de Janeiro, RJ <br />
                                        Brasil
                                    </p> */}
                                </div>
                            </div>

                            {/* Coluna do Formulário */}
                            <div className="w-full xl:w-7/12 bg-white p-6 lg:p-8 shadow-2xl h-fit border-t-4 border-black">
                                <form className="flex flex-col gap-6 text-[10px] uppercase font-bold tracking-widest text-black" onSubmit={handleSubmit}>

                                    <div className="flex flex-col gap-2">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="SEU EMAIL"
                                            required
                                            disabled={isSubmitting}
                                            className="border-b border-gray-300 pb-2 outline-none focus:border-black transition-colors bg-transparent text-xs placeholder:text-gray-400 font-medium disabled:opacity-60"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label>Assunto</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="border-b border-gray-300 pb-2 outline-none focus:border-black transition-colors bg-transparent appearance-none text-xs font-medium cursor-pointer disabled:opacity-60"
                                        >
                                            <option>Dúvida Geral</option>
                                            <option>Programas Executivos</option>
                                            <option>In company</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label>Mensagem</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={2}
                                            disabled={isSubmitting}
                                            className="border-b border-gray-300 pb-2 outline-none focus:border-black transition-colors bg-transparent resize-none text-xs font-medium disabled:opacity-60"
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="privacy"
                                            name="agreedToPrivacy"
                                            checked={formData.agreedToPrivacy}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="w-3 h-3 accent-black cursor-pointer"
                                        />
                                        <label htmlFor="privacy" className="cursor-pointer text-[9px]">
                                            Concordo com a política de privacidade
                                        </label>
                                    </div>

                                    {feedback && (
                                        <p className={`text-[9px] normal-case font-semibold ${feedback.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
                                            {feedback.message}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-[#111] text-white py-4 font-bold tracking-[0.2em] hover:bg-black transition-colors mt-2 w-full text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
                                    </button>

                                </form>
                            </div>

                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}