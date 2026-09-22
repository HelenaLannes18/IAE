"use client";

import React, { useRef, useState } from 'react';

interface ImageUrlInputProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    inputClassName?: string;
}

export default function ImageUrlInput({ value, onChange, placeholder = 'https://...', inputClassName }: ImageUrlInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setIsUploading(true);
        try {
            const body = new FormData();
            body.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Falha ao enviar imagem.');
            onChange(data.url);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Erro ao enviar imagem.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex-1 min-w-0 flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={inputClassName || 'flex-1 min-w-0 px-4 py-3 bg-[var(--a-input-bg)] border border-transparent rounded-2xl text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40 transition-all'}
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Escolher do computador"
                className="shrink-0 px-4 py-3 rounded-2xl bg-[var(--a-text)]/5 text-[var(--a-text)] text-sm font-bold hover:bg-[var(--a-text)]/10 transition-colors disabled:opacity-50"
            >
                {isUploading ? 'Enviando...' : 'Procurar...'}
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}
