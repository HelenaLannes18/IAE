'use client';

import { motion } from 'framer-motion';
import { PieChart, Globe, ArrowUpRight } from 'lucide-react'; // Ícones minimalistas para os valores

export default function QuemSomos() {
    // Variáveis de animação padrão para manter a consistência do site
    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        // Fundo Off-White da paleta IAE
        <main className="bg-[#F3F1EC] text-[#16243A] font-sans min-h-screen selection:bg-[#16243A] selection:text-white pt-32 pb-32">

            {/* =========================================
          HEADER GLOBAL (Você pode extrair isso para um layout.tsx depois para não repetir)
          ========================================= */}
            <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 md:px-12 py-4 z-50 bg-[#F3F1EC]/90 backdrop-blur-md border-b border-[#16243A]/10">
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#16243A] text-[#F3F1EC] flex items-center justify-center font-bold font-serif text-sm">
                        IAE
                    </div>
                    <span className="font-bold text-xl tracking-tighter">Board</span>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-medium">
                    {/* @ts-ignore */}
                    <a href="/" className="hover:opacity-70 transition-opacity">Início</a>
                    <a href="/quem-somos" className="opacity-50">Quem Somos</a>
                    <a href="#educacao" className="hover:opacity-70 transition-opacity">Educação Executiva</a>
                    <a href="#docentes" className="hover:opacity-70 transition-opacity">Corpo Docente</a>
                </nav>
                <button className="hidden md:block bg-[#16243A] text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-[#3A3733] transition-colors">
                    Contato
                </button>
            </header>


            {/* =========================================
          1. INTRODUÇÃO (Imagem Vertical + Texto Forte)
          ========================================= */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto mt-12 md:mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Imagem Esquerda */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-gray-200 rounded-sm shadow-sm"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
                            alt="Prédios Corporativos"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Texto Direita */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex flex-col"
                    >
                        {/* @ts-ignore */}
                        <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-[#9A9186] font-bold mb-6">
                            Sobre Nós
                        </motion.span>
                        {/* @ts-ignore */}
                        <motion.h1 variants={fadeUp} className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-8">
                            Conectando a excelência acadêmica à realidade prática corporativa.
                        </motion.h1>
                        {/* @ts-ignore */}
                        <motion.p variants={fadeUp} className="text-[#3A3733]/80 leading-relaxed text-lg max-w-lg">
                            O Instituto de Advocacia Empresarial (IAE) nasceu da necessidade de preparar profissionais não apenas para interpretar a lei, mas para serem agentes estratégicos de decisão no coração das empresas.
                        </motion.p>
                    </motion.div>

                </div>
            </section>


            {/* =========================================
          2. NOSSOS VALORES (Grid de Cards Clean)
          ========================================= */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto mt-32 md:mt-48">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Nossos Valores</h2>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {/* Card 1 */}
                    {/* @ts-ignore */}
                    <motion.div variants={fadeUp} className="bg-white p-10 md:p-12 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <PieChart className="w-6 h-6 text-[#16243A] mb-8" strokeWidth={1.5} />
                        <h3 className="font-bold text-lg mb-4">Visão Estratégica</h3>
                        <p className="text-[#3A3733]/70 text-sm leading-relaxed">
                            Formamos advogados que enxergam além do risco jurídico, atuando como parceiros de negócio e viabilizadores de soluções.
                        </p>
                    </motion.div>

                    {/* Card 2 */}
                    {/* @ts-ignore */}
                    <motion.div variants={fadeUp} className="bg-white p-10 md:p-12 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <Globe className="w-6 h-6 text-[#16243A] mb-8" strokeWidth={1.5} />
                        <h3 className="font-bold text-lg mb-4">Prática de Mercado</h3>
                        <p className="text-[#3A3733]/70 text-sm leading-relaxed">
                            Nosso corpo docente é formado exclusivamente por líderes ativos em posições de destaque no setor corporativo.
                        </p>
                    </motion.div>

                    {/* Card 3 */}
                    {/* @ts-ignore */}
                    <motion.div variants={fadeUp} className="bg-white p-10 md:p-12 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <ArrowUpRight className="w-6 h-6 text-[#16243A] mb-8" strokeWidth={1.5} />
                        <h3 className="font-bold text-lg mb-4">Crescimento Acelerado</h3>
                        <p className="text-[#3A3733]/70 text-sm leading-relaxed">
                            Foco no desenvolvimento de soft skills essenciais, como liderança, negociação e inteligência emocional aplicadas ao direito.
                        </p>
                    </motion.div>
                </motion.div>
            </section>


            {/* =========================================
          3. NOSSA HISTÓRIA
          ========================================= */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto mt-32 md:mt-48">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="w-full aspect-square md:aspect-[4/5] overflow-hidden bg-gray-200 rounded-sm shadow-sm order-2 md:order-1"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1000&auto=format&fit=crop"
                            alt="Reunião IAE"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex flex-col order-1 md:order-2"
                    >
                        {/* @ts-ignore */}
                        <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-[#9A9186] font-bold mb-6">
                            Nossa História
                        </motion.span>
                        {/* @ts-ignore */}
                        <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight mb-8 pr-8">
                            Instituto de Advocacia Empresarial
                        </motion.h2>
                        {/* @ts-ignore */}
                        <motion.p variants={fadeUp} className="text-[#3A3733]/80 leading-relaxed text-base mb-6">
                            O IAE surge da constatação de uma lacuna crítica na formação jurídica tradicional: o distanciamento entre a academia e a sala de reuniões corporativa.
                        </motion.p>
                        {/* @ts-ignore */}
                        <motion.p variants={fadeUp} className="text-[#3A3733]/80 leading-relaxed text-base">
                            Nosso objetivo primário é ser a ponte definitiva entre a teoria e a realidade, fornecendo as ferramentas mentais e técnicas necessárias para que o profissional do direito brilhe no ambiente corporativo dinâmico de hoje.
                        </motion.p>
                    </motion.div>

                </div>
            </section>


            {/* =========================================
          4. NOSSO TIME (Lista Editorial Minimalista)
          ========================================= */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto mt-32 md:mt-48 mb-20">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Nosso Time</h2>
                </motion.div>

                {/* Tabela / Lista */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full flex flex-col"
                >
                    {/* Cabeçalho da Tabela (Opcional, no seu design tem uma versão minúscula em cima) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#16243A]/10 text-[10px] uppercase tracking-widest text-[#9A9186] font-bold">
                        <div className="col-span-4">Nome</div>
                        <div className="col-span-4">Especialidade / Cargo</div>
                        <div className="col-span-4 text-right">Contato</div>
                    </div>

                    {/* Linhas da Tabela */}
                    {[
                        { nome: "Guga Costa", cargo: "Presidente", email: "g.costa@iae.com.br" },
                        { nome: "Rodrigo Gadban", cargo: "Coordenador Acadêmico", email: "r.gadban@iae.com.br" },
                        { nome: "Daniela Vilhena", cargo: "Sócia de Advocacia", email: "d.vilhena@iae.com.br" },
                        { nome: "José Guilherme", cargo: "Diretor Jurídico", email: "j.guilherme@iae.com.br" },
                        { nome: "Ana Flávia", cargo: "Head de Compliance", email: "a.flavia@iae.com.br" },
                        { nome: "Carlos Eduardo", cargo: "Conselheiro Estratégico", email: "c.eduardo@iae.com.br" },
                        { nome: "Mariana Luz", cargo: "Especialista Tributária", email: "m.luz@iae.com.br" },
                    ].map((membro, index) => (
                        <motion.div
                            key={index}
                            // @ts-ignore
                            variants={fadeUp}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-6 md:py-8 border-b border-[#16243A]/10 items-center group hover:bg-white/50 transition-colors px-2"
                        >
                            {/* Coluna Nome */}
                            <div className="col-span-12 md:col-span-4 font-bold text-base md:text-lg">
                                {membro.nome}
                            </div>

                            {/* Coluna Especialidade */}
                            <div className="col-span-12 md:col-span-4 text-[#3A3733]/80 text-sm md:text-base">
                                {membro.cargo}
                            </div>

                            {/* Coluna Contato */}
                            <div className="col-span-12 md:col-span-4 md:text-right mt-2 md:mt-0">
                                <a
                                    href={`mailto:${membro.email}`}
                                    className="text-sm border-b border-[#16243A]/20 pb-0.5 hover:text-[#C7BFB3] hover:border-[#C7BFB3] transition-colors"
                                >
                                    {membro.email}
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </section>

        </main>
    );
}