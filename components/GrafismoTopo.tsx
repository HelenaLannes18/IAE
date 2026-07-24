import React from 'react';

// Grafismo institucional em linhas — alternativa a foto de banco de imagem,
// conforme ANEXO A, item 3 do documento do cliente ("sem banco de imagens
// com pessoas"). Trocar por fotografia real da fachada/ambientes da
// Rua São José, 40 assim que disponível.

const VARIANTS: Record<number, string> = {
    0: "M0,320 L400,120 L800,280 L1200,80", // diagonal ascendente
    1: "M0,160 L300,320 L700,100 L1200,260", // onda
    2: "M0,260 L500,90 L900,310 L1200,150", // pico central
    3: "M0,120 L350,300 L750,130 L1200,290", // onda invertida
};

export default function GrafismoTopo({
    variant = 0,
    label,
}: {
    variant?: number;
    label: string;
}) {
    const path = VARIANTS[variant % 4];

    return (
        <div className="w-full aspect-[21/9] bg-[#111111] relative overflow-hidden rounded-2xl">
            <svg
                viewBox="0 0 1200 400"
                preserveAspectRatio="none"
                className="w-full h-full opacity-40"
            >
                {/* grade fina, como planta arquitetônica */}
                {Array.from({ length: 13 }).map((_, i) => (
                    <line
                        key={`v-${i}`}
                        x1={i * 100}
                        y1="0"
                        x2={i * 100}
                        y2="400"
                        stroke="white"
                        strokeWidth="0.5"
                        opacity="0.15"
                    />
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                    <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 100}
                        x2="1200"
                        y2={i * 100}
                        stroke="white"
                        strokeWidth="0.5"
                        opacity="0.15"
                    />
                ))}
                <path d={path} fill="none" stroke="white" strokeWidth="1.5" />
            </svg>

            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between">
                <span className="text-white/70 text-[11px] uppercase tracking-[0.2em]">
                    {label}
                </span>
                <span className="text-white/40 text-[11px] uppercase tracking-[0.2em]">
                    Rua São José, 40 — Centro, Rio de Janeiro
                </span>
            </div>
        </div>
    );
}