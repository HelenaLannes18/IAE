"use client";

import React, { useId, useMemo } from 'react';

interface ActivityChartProps {
    points: { label: string; value: number }[];
    height?: number;
}

// Converte uma série de pontos em um path suave (Catmull-Rom -> Bezier),
// igual ao efeito de curva orgânica das referências de dashboard.
function buildSmoothPath(coords: { x: number; y: number }[]): string {
    if (coords.length < 2) return '';
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i - 1] || coords[i];
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const p3 = coords[i + 2] || p2;
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

export default function ActivityChart({ points, height = 200 }: ActivityChartProps) {
    const gradientId = useId();
    const width = 700;
    const padding = 24;
    // Evita que os rótulos do eixo colidam quando há muitos pontos (ex: intervalo de 30 dias)
    const labelStep = Math.max(1, Math.ceil(points.length / 8));

    const { linePath, areaPath, coords, maxValue } = useMemo(() => {
        const max = Math.max(1, ...points.map((p) => p.value));
        const stepX = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
        const coords = points.map((p, i) => ({
            x: padding + i * stepX,
            y: padding + (1 - p.value / max) * (height - padding * 2),
        }));
        const line = buildSmoothPath(coords);
        const area = coords.length
            ? `${line} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`
            : '';
        return { linePath: line, areaPath: area, coords, maxValue: max };
    }, [points, height]);

    return (
        <div className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--a-accent)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--a-accent)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Linha de base */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--a-border)" strokeWidth="1" />

                {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}
                {linePath && <path d={linePath} fill="none" stroke="var(--a-accent)" strokeWidth="2.5" strokeLinecap="round" />}

                {coords.map((c, i) => (
                    points[i].value > 0 && (
                        <circle key={i} cx={c.x} cy={c.y} r="3" fill="var(--a-surface)" stroke="var(--a-accent)" strokeWidth="2" />
                    )
                ))}
            </svg>
            <div className="flex justify-between mt-2 px-1">
                {points.map((p, i) => (
                    <span key={i} className="text-[10px] md:text-xs text-[var(--a-muted)]" title={`${p.value} contato(s)`}>
                        {(i % labelStep === 0 || i === points.length - 1) ? p.label : ''}
                    </span>
                ))}
            </div>
            <span className="sr-only">Pico no período: {maxValue} contato(s) em um único dia.</span>
        </div>
    );
}
