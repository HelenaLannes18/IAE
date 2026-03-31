"use client";
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

export default function EcosystemBentoGrid() {
    return (
        <section className="py-32 max-w-7xl mx-auto px-4">
            <div className="mb-20 text-center">
                <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 tracking-tight">
                    An ecosystem built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">scale.</span>
                </motion.h2>
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-xl text-gray-500 max-w-2xl mx-auto">
                    Everything you need to accelerate your business, consolidated into one premium network.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="md:col-span-2 bg-gray-900 rounded-[2.5rem] p-10 min-h-[450px] relative overflow-hidden group flex flex-col justify-end shadow-xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                        <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }} className="absolute w-40 h-40 border border-orange-500 rounded-full"></motion.div>
                        <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 1.3 }} className="absolute w-40 h-40 border border-orange-500 rounded-full"></motion.div>
                        <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2.6 }} className="absolute w-40 h-40 border border-orange-500 rounded-full"></motion.div>
                        <div className="w-4 h-4 bg-orange-500 rounded-full z-10 shadow-[0_0_30px_#f97316]"></div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Global Reach</h3>
                        <p className="text-lg text-gray-400 max-w-md">Connect instantly with verified business leaders across 40+ countries. No borders, just growth.</p>
                    </div>
                </motion.div>

                <div className="md:col-span-1 flex flex-col gap-6">
                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex-1 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between group shadow-xl">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-white mb-2">Venture Capital</h3>
                            <p className="text-orange-100 font-medium">Pitch directly to active investors.</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="flex-1 bg-gray-100 rounded-[2.5rem] p-8 flex flex-col justify-between group shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex -space-x-4 mb-6">
                            {[1, 2, 3].map((i) => (
                                <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }} className="w-14 h-14 rounded-full border-4 border-gray-100 bg-gray-300 shadow-md overflow-hidden relative">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                            <div className="w-14 h-14 rounded-full border-4 border-gray-100 bg-gray-900 shadow-md flex items-center justify-center text-sm font-bold text-white z-10">+9k</div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Masterminds</h3>
                            <p className="text-gray-500 font-medium">Solve complex problems with peers.</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="md:col-span-1 bg-white border border-gray-200 rounded-[2.5rem] p-10 flex flex-col justify-center shadow-sm hover:shadow-xl transition-shadow group">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-8 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Frameworks</h3>
                    <p className="text-gray-500">Access a curated library of proven operational SOPs and templates.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }} className="md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-10 overflow-hidden relative flex flex-col justify-center min-h-[250px] shadow-xl">
                    <div className="absolute inset-0 flex items-center">
                        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-8 text-[6rem] font-black text-white/5 select-none pointer-events-none">
                            <span>GROWTH • LEADERSHIP • INNOVATION • STRATEGY • FUNDING • NETWORKING •</span>
                            <span>GROWTH • LEADERSHIP • INNOVATION • STRATEGY • FUNDING • NETWORKING •</span>
                        </motion.div>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <h3 className="text-4xl font-extrabold text-white mb-2">Continuous Growth</h3>
                            <p className="text-gray-400 text-lg max-w-sm">Your business shouldn't stop evolving. Neither do we.</p>
                        </div>
                        <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="shrink-0 bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-full font-bold transition-transform hover:scale-105">
                            Start Your Journey
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}