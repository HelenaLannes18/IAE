"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type ToastKind = 'success' | 'error';
interface ToastItem {
    id: number;
    kind: ToastKind;
    message: string;
}

interface ToastContextValue {
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const idRef = useRef(0);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((kind: ToastKind, message: string) => {
        const id = ++idRef.current;
        setToasts((prev) => [...prev, { id, kind, message }]);
        setTimeout(() => remove(id), 5000);
    }, [remove]);

    const value: ToastContextValue = {
        success: (message: string) => push('success', message),
        error: (message: string) => push('error', message),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        className="flex items-start gap-3 rounded-2xl shadow-xl px-4 py-3.5 bg-[var(--a-surface)] animate-[toast-in_0.2s_ease-out]"
                    >
                        {t.kind === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[var(--a-accent)]" />
                        ) : (
                            <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-[var(--a-danger)]" />
                        )}
                        <p className="text-sm font-medium flex-1 text-[var(--a-text)]">{t.message}</p>
                        <button
                            onClick={() => remove(t.id)}
                            className="shrink-0 p-0.5 rounded-md text-[var(--a-faint)] hover:text-[var(--a-text)] hover:bg-[var(--a-text)]/5 transition-colors"
                            aria-label="Fechar notificação"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes toast-in {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast deve ser usado dentro de um ToastProvider');
    return ctx;
}
