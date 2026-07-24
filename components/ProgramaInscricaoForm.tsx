"use client";

import React, { useState } from 'react';

type Props = {
    programaTitulo: string;
    ctaPrimario: string;
    /** true = programa confirmado (inscrição); false = lista de espera */
    inscricaoAberta: boolean;
};

const COURSES = [
    { value: "direito-regulatorio", label: "Direito Regulatório" },
    { value: "gestao-juridica", label: "Gestão do Departamento Jurídico" },
    { value: "compliance", label: "Compliance e Governança" },
    { value: "inovacao", label: "Inovação e Tecnologia Jurídica" },
];

export default function ProgramaInscricaoForm({ programaTitulo, ctaPrimario, inscricaoAberta }: Props) {
    const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
    const [feedbackError, setFeedbackError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        setFeedbackError(null);

        // Coleta os dados do formulário
        const formData = new FormData(e.currentTarget);
        const rawData = Object.fromEntries(formData.entries());

        // Mapeia para o padrão que a sua /api/contact já aceita
        const payload = {
            name: rawData.nome,
            email: rawData.email,
            phone: rawData.telefone,
            course: rawData.programa, // Usa o título do programa atual
            situacao: rawData.situacao,
            tipoAcao: rawData.tipoAcao
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                setStatus("sent");
            } else {
                setFeedbackError(data.error || "Não foi possível enviar. Tente novamente.");
                setStatus("idle");
            }
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            setFeedbackError("Erro de conexão. Verifique sua internet e tente novamente.");
            setStatus("idle");
        }
    };

    if (status === "sent") {
        return (
            <div className="bg-white p-10 md:p-16 flex flex-col items-center justify-center h-full min-h-[500px]">
                <p className="text-3xl font-medium text-slate-900 mb-6 text-center">Recebemos seus dados.</p>
                <p className="text-slate-600 font-light text-xl text-center max-w-md leading-relaxed">
                    {inscricaoAberta
                        ? "A coordenação acadêmica entrará em contato em breve para confirmar sua vaga."
                        : "Você está na lista de espera e será avisado assim que a próxima turma for aberta."}
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 flex flex-col h-full justify-between min-h-[500px]">
            <div className="flex flex-col gap-10 mb-12">
                <div className="flex flex-col gap-2">
                    <label htmlFor="nome" className="text-xs uppercase tracking-[0.15em] font-medium text-slate-500">
                        Nome
                    </label>
                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        required
                        disabled={status === "submitting"}
                        className="border-b border-slate-300 focus:border-black outline-none py-2 text-xl font-light text-slate-900 bg-transparent transition-colors disabled:opacity-50"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-[0.15em] font-medium text-slate-500">
                        E-mail
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        disabled={status === "submitting"}
                        className="border-b border-slate-300 focus:border-black outline-none py-2 text-xl font-light text-slate-900 bg-transparent transition-colors disabled:opacity-50"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="telefone" className="text-xs uppercase tracking-[0.15em] font-medium text-slate-500">
                        Telefone
                    </label>
                    <input
                        id="telefone"
                        name="telefone"
                        type="tel"
                        required
                        disabled={status === "submitting"}
                        className="border-b border-slate-300 focus:border-black outline-none py-2 text-xl font-light text-slate-900 bg-transparent transition-colors disabled:opacity-50"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="course" className="text-xs uppercase tracking-[0.15em] font-medium text-slate-500">
                        Programa de interesse
                    </label>
                    <select
                        id="course"
                        name="course"
                        required
                        defaultValue=""
                        disabled={status === "submitting"}
                        className="border-b border-slate-300 focus:border-black outline-none py-2 text-xl font-light text-slate-900 bg-transparent transition-colors appearance-none rounded-none cursor-pointer disabled:opacity-50"
                    >
                        <option value="" disabled>Selecione</option>
                        {COURSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Campos ocultos para enviar o contexto ao backend */}
            <input type="hidden" name="programa" value={programaTitulo} />
            <input type="hidden" name="tipoAcao" value={inscricaoAberta ? "Inscrição" : "Lista de Espera"} />

            <div className="flex flex-col gap-4">
                {feedbackError && (
                    <p className="text-sm font-medium text-red-600 text-center">
                        {feedbackError}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="bg-black hover:bg-slate-800 disabled:bg-slate-400 text-white px-10 py-5 font-medium text-sm uppercase tracking-[0.15em] transition-all w-full text-center"
                >
                    {status === "submitting" ? "Enviando..." : ctaPrimario}
                </button>
            </div>
        </form>
    );
}