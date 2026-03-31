"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function ApplicationForm() {
    return (
        // Alterado o fundo para preto puro (bg-black) e texto base para branco (text-white)
        <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-24 bg-black px-4 text-white relative"
        >
            <div className="max-w-5xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">

                {/* --- Lado Esquerdo: Textos --- */}
                <div>
                    <h2 className="text-5xl md:text-7xl font-regular mb-6 leading-tight text-white">
                        Fale <br />
                        {/* Connosco agora 100% branco e em negrito */}
                        <span className="text-white font-bold">Connosco</span>
                    </h2>

                    {/* Parágrafo 100% branco */}
                    <p className="text-xl text-white mb-8 leading-relaxed max-w-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    {/* Linha decorativa branca com um pouco de transparência */}
                    <div className="w-20 h-1.5 bg-white rounded-full mt-10 opacity-50"></div>
                </div>

                {/* --- Lado Direito: Formulário --- */}
                <div className="bg-[#F3F1EC] rounded-3xl p-8 md:p-10 shadow-2xl text-[#3A3733]">
                    <form className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">

                            <div className="col-span-2">
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186]"
                                />
                            </div>

                            <div className="col-span-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186]"
                                />
                            </div>

                            <div className="col-span-2">
                                <input
                                    type="text"
                                    placeholder="Telefone"
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186]"
                                />
                            </div>

                            <div className="col-span-2">
                                <input
                                    type="text"
                                    placeholder="Curso de interesse"
                                    className="w-full bg-white border border-[#C7BFB3]/50 rounded-xl px-5 py-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors text-[#3A3733] placeholder:text-[#9A9186]"
                                />
                            </div>

                        </div>

                        {/* Botão alterado para preto para harmonizar com o fundo */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl mt-4 shadow-lg shadow-black/20 transition-all tracking-wider uppercase text-sm"
                        >
                            Enviar
                        </motion.button>

                    </form>
                </div>

            </div>
        </motion.section>
    );
}