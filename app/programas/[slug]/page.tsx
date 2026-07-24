import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import GrafismoTopo from '@/components/GrafismoTopo';
import ProgramaInscricaoForm from '@/components/ProgramaInscricaoForm';
import Link from 'next/link';
import { PROGRAMAS, getProgramaBySlug, type Programa } from '@/lib/programas-data';

const SITE_URL = "https://www.iae.edu.br";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return PROGRAMAS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const programa = getProgramaBySlug(slug);
    if (!programa) return {};

    return {
        title: programa.seo.titleTag,
        description: programa.seo.metaDescription,
        keywords: [programa.seo.keywordPrincipal, ...programa.seo.secundarias],
        alternates: { canonical: `/programas/${programa.slug}/` },
    };
}

function buildJsonLd(programa: Programa) {
    const courseSchema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: programa.h1,
        description: programa.seo.metaDescription,
        provider: {
            "@type": "EducationalOrganization",
            name: "Instituto de Advocacia Empresarial",
            sameAs: SITE_URL,
        },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Onsite",
            courseWorkload: "PT24H",
            location: {
                "@type": "Place",
                name: "Instituto de Advocacia Empresarial",
                address: {
                    "@type": "PostalAddress",
                    streetAddress: "Rua São José, 40",
                    addressLocality: "Rio de Janeiro",
                    addressRegion: "RJ",
                    addressCountry: "BR",
                },
            },
            ...(programa.status === "confirmado"
                ? { startDate: "2026-10-01" }
                : {}),
        },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: programa.faq.map((item) => ({
            "@type": "Question",
            name: item.pergunta,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.resposta,
            },
        })),
    };

    return [courseSchema, faqSchema];
}

export default async function ProgramaPage({ params }: PageProps) {
    const { slug } = await params;
    const programa = getProgramaBySlug(slug);
    if (!programa) notFound();

    const outrosProgramas = PROGRAMAS.filter((p) => p.slug !== programa.slug);
    const inscricaoAberta = programa.status === "confirmado";
    const jsonLd = buildJsonLd(programa);

    return (
        <div className="min-h-screen bg-[#f4f4f4] text-slate-900 font-sans selection:bg-slate-300 selection:text-black">
            {jsonLd.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <Header />

            <main className="pt-24 md:pt-32">
                {/* 1. HERO - Estilo Editorial e Clean */}
                <section className="px-4 md:px-10 lg:px-16 pb-16 md:pb-24">
                    <AnimatedSection mode="onLoad" as="span" className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-8 block">
                        {programa.status === "confirmado" ? "Turma confirmada — outubro de 2026" : "Lista de espera"} · Rio de Janeiro
                    </AnimatedSection>

                    <AnimatedSection mode="onLoad" delay={0.1} as="h1" className="text-6xl md:text-8xl lg:text-[7rem] font-medium leading-[0.9] tracking-tighter uppercase mb-12">
                        {programa.h1}
                    </AnimatedSection>

                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-4 lg:col-span-3">
                            <AnimatedSection mode="onLoad" delay={0.4}>
                                <a href="#inscricao">
                                    <button className="bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-full font-medium text-xs uppercase tracking-[0.15em] transition-all w-full md:w-auto">
                                        {programa.ctaPrimario}
                                    </button>
                                </a>
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-7">
                            <AnimatedSection mode="onLoad" delay={0.25} as="p" className="text-xl md:text-3xl font-light text-slate-700 leading-snug">
                                {programa.posicionamento}
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* 2. IMAGEM DE TOPO */}
                <section className="px-4 md:px-10 lg:px-16 pb-20 md:pb-32">
                    <AnimatedSection className="w-full h-[40vh] md:h-[60vh] lg:h-[70vh] relative overflow-hidden bg-slate-200 rounded-none border border-black/10">
                        {/* Substitua o 'src' abaixo pelo caminho da sua imagem real (ex: '/images/minha-imagem.jpg').
                          As classes Tailwind garantem o efeito editorial:
                          - grayscale: deixa a imagem em preto e branco
                          - contrast-125: aumenta o contraste (preto mais preto, branco mais branco)
                          - object-cover: faz a imagem preencher todo o container sem achatar
                        */}
                        <img
                            src="https://images.unsplash.com/photo-1552406795-883a16019d35?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt={`Imagem de destaque para ${programa.h1}`}
                            className="w-full h-full object-cover grayscale contrast-125"
                        />
                    </AnimatedSection>
                </section>

                {/* 3. SOBRE O PROGRAMA (Grid 2 colunas tipo vídeo) */}
                <section className="border-t border-black/20 px-4 md:px-10 lg:px-16 py-16 md:py-24">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 lg:col-span-3">
                            <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500 sticky top-24">
                                Description
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-8">
                            {programa.sobre.map((paragrafo, i) => (
                                <AnimatedSection key={i} delay={i * 0.05} as="p" className="text-2xl md:text-4xl text-slate-900 leading-snug font-light">
                                    {paragrafo}
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. PARA QUEM É */}
                {/* <section className="border-t border-black/20 px-4 md:px-10 lg:px-16 py-16 md:py-24">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 lg:col-span-3">
                            <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">
                                Para quem é
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-9">
                            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
                                {programa.paraQuemE.perfis.map((perfil, i) => (
                                    <AnimatedSection key={i} delay={i * 0.1}>
                                        <p className="text-2xl font-medium text-slate-900 mb-4">{perfil.titulo}</p>
                                        <p className="text-lg text-slate-600 leading-relaxed font-light">{perfil.texto}</p>
                                    </AnimatedSection>
                                ))}
                            </div>
                            {programa.paraQuemE.complemento && (
                                <AnimatedSection as="p" className="text-slate-500 mt-12 text-lg font-light max-w-3xl">
                                    {programa.paraQuemE.complemento}
                                </AnimatedSection>
                            )}
                        </div>
                    </div>
                </section> */}

                {/* 5. ESTRUTURA DO PROGRAMA (Accordions HTML Nativos) */}
                <section className="border-t border-black/20 px-4 md:px-10 lg:px-16 py-16 md:py-32">
                    <div className="grid md:grid-cols-12 gap-8 mb-16">
                        <div className="md:col-span-4 lg:col-span-3">
                            <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">
                                Composição
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-9">
                            <AnimatedSection as="h3" className="text-5xl md:text-7xl font-medium leading-[0.95] tracking-tighter">
                                Estrutura do programa detalhada
                            </AnimatedSection>
                            <AnimatedSection as="p" className="text-slate-600 mt-8 text-xl max-w-2xl font-light">
                                {programa.cargaHorariaResumo}
                            </AnimatedSection>
                        </div>
                    </div>

                    {/* Accordion List - Inspired by Video */}
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-start-5 md:col-span-8 lg:col-span-8 border-t border-black/20">
                            {programa.estrutura.map((bloco, bi) => (
                                <AnimatedSection key={bloco.titulo} delay={bi * 0.05}>
                                    <details className="group border-b border-black/10 transition-colors hover:bg-black/[0.02]">
                                        <summary className="flex items-center justify-between py-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                            <div className="flex gap-8 items-center">
                                                <span className="text-2xl font-light text-slate-400">
                                                    {String(bi + 1).padStart(2, '0')}
                                                </span>
                                                <h4 className="text-2xl md:text-3xl font-medium text-slate-900">
                                                    {bloco.titulo}
                                                </h4>
                                            </div>
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-black/10 flex items-center justify-center transition-transform duration-300 group-open:rotate-45">
                                                <span className="text-3xl font-light leading-none mb-1">+</span>
                                            </div>
                                        </summary>
                                        <div className="pb-8 pl-14 pr-4 text-lg text-slate-600 font-light leading-relaxed flex flex-col gap-4">
                                            {bloco.encontros.map((encontro, ei) => (
                                                <p key={ei} className="relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-slate-300 before:rounded-full before:absolute before:-left-6 before:top-2.5">
                                                    {encontro}
                                                </p>
                                            ))}
                                        </div>
                                    </details>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. COMPETÊNCIAS / METODOLOGIA */}
                <section className="border-t border-black/20 px-4 md:px-10 lg:px-16 py-16 md:py-24">
                    <div className="grid md:grid-cols-12 gap-16">
                        <div className="md:col-span-6 flex flex-col gap-12">
                            <div>
                                <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500 mb-8">
                                    O que você vai desenvolver
                                </AnimatedSection>
                                <div className="flex flex-col gap-6">
                                    {programa.competencias.map((item, i) => (
                                        <AnimatedSection key={i} delay={i * 0.05} className="flex gap-6 items-start border-b border-black/10 pb-6">
                                            <span className="text-slate-400 text-xl font-light tabular-nums shrink-0 mt-1">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-xl text-slate-800 font-light leading-snug">{item}</span>
                                        </AnimatedSection>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-6 flex flex-col gap-8">
                            <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500 mb-2">
                                Metodologia
                            </AnimatedSection>
                            {programa.metodologia.map((paragrafo, i) => (
                                <AnimatedSection key={i} delay={i * 0.05} as="p" className="text-xl text-slate-600 leading-relaxed font-light">
                                    {paragrafo}
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. INFORMAÇÕES GERAIS */}
                <section className="border-t border-black/20 px-4 md:px-10 lg:px-16 py-16 md:py-24">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 lg:col-span-3">
                            <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">
                                Informações gerais
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-9">
                            <AnimatedSection>
                                <div className="border-t border-black/20">
                                    {programa.infoGerais.map((info) => (
                                        <div key={info.label} className="grid sm:grid-cols-3 gap-4 py-8 border-b border-black/10">
                                            <dt className="text-sm uppercase tracking-widest text-slate-500">
                                                {info.label}
                                            </dt>
                                            <dd className="sm:col-span-2 text-xl text-slate-900 font-light">{info.valor}</dd>
                                        </div>
                                    ))}
                                </div>
                            </AnimatedSection>
                            {programa.blocoCaptura && (
                                <AnimatedSection className="mt-16 bg-white border border-black/10 p-10">
                                    <p className="text-xl text-slate-700 font-light leading-relaxed">{programa.blocoCaptura}</p>
                                </AnimatedSection>
                            )}
                        </div>
                    </div>
                </section>

                {/* 8. PERGUNTAS FREQUENTES */}
                <section className="border-t border-black/20 px-4 md:px-10 lg:px-16 py-16 md:py-24">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 lg:col-span-3">
                            <AnimatedSection as="h2" className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">
                                FAQ
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-9 border-t border-black/20">
                            {programa.faq.map((item, i) => (
                                <AnimatedSection key={i} delay={i * 0.05}>
                                    <details className="group border-b border-black/10 transition-colors hover:bg-black/[0.02]">
                                        <summary className="flex items-center justify-between py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                            <h4 className="text-xl md:text-2xl font-light text-slate-900 pr-8">
                                                {item.pergunta}
                                            </h4>
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300 group-open:rotate-45">
                                                <span className="text-2xl font-light leading-none mb-1">+</span>
                                            </div>
                                        </summary>
                                        <div className="pb-8 text-lg text-slate-600 font-light leading-relaxed max-w-3xl">
                                            {item.resposta}
                                        </div>
                                    </details>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 9. INSCRIÇÃO (Bloco Escuro final) */}
                <section id="inscricao" className="bg-[#111111] text-white px-4 md:px-10 lg:px-16 py-20 md:py-32">
                    <div className="grid md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 lg:col-span-5">
                            <AnimatedSection as="h2" className="text-5xl md:text-7xl font-medium tracking-tighter uppercase leading-[0.9] sticky top-24">
                                Faça parte. <br />
                                <span className="text-gray-500">Envie seu contato</span>
                            </AnimatedSection>
                        </div>
                        <div className="md:col-span-8 lg:col-span-6 lg:col-start-7">
                            <AnimatedSection>
                                <ProgramaInscricaoForm
                                    programaTitulo={programa.h1}
                                    ctaPrimario={programa.ctaPrimario}
                                    inscricaoAberta={inscricaoAberta}
                                />
                            </AnimatedSection>
                        </div>
                    </div>
                </section>
            </main>

            {/* O Footer original, dependendo da sua estilização, encaixará naturalmente abaixo do formulário preto */}
            <Footer />
        </div>
    );
}