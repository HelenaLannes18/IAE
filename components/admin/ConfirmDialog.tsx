"use client";

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback<ConfirmFn>((opts) => {
        const normalized = typeof opts === 'string' ? { message: opts } : opts;
        setOptions(normalized);
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    }, []);

    const handleClose = (value: boolean) => {
        resolver?.(value);
        setOptions(null);
        setResolver(null);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            {options && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => handleClose(false)}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[var(--a-surface)] rounded-[28px] shadow-2xl w-full max-w-sm p-6 animate-[dialog-in_0.15s_ease-out]"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${options.danger !== false ? 'bg-[var(--a-danger)]/15 text-[var(--a-danger)]' : 'bg-[var(--a-accent)]/15 text-[var(--a-accent)]'}`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-[var(--a-text)] text-lg">{options.title || 'Confirmar ação'}</h3>
                                <p className="text-sm text-[var(--a-muted)] mt-1.5">{options.message}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => handleClose(false)}
                                className="px-4 py-2.5 rounded-full text-sm font-bold text-[var(--a-text)] bg-[var(--a-text)]/5 hover:bg-[var(--a-text)]/10 transition-colors"
                            >
                                {options.cancelLabel || 'Cancelar'}
                            </button>
                            <button
                                autoFocus
                                onClick={() => handleClose(true)}
                                className={`px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${options.danger !== false ? 'bg-[var(--a-danger)] hover:bg-[var(--a-danger-hover)] text-[var(--a-danger-contrast)]' : 'bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)]'}`}
                            >
                                {options.confirmLabel || 'Confirmar'}
                            </button>
                        </div>
                    </div>
                    <style jsx global>{`
                        @keyframes dialog-in {
                            from { opacity: 0; transform: scale(0.96); }
                            to { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </div>
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error('useConfirm deve ser usado dentro de um ConfirmProvider');
    return ctx;
}
