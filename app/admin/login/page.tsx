"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(data.error || 'Não foi possível entrar.');
            }
        } catch (err) {
            console.error(err);
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--a-accent)]/10 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--a-highlight-to)]/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <span className="text-3xl font-extrabold text-[var(--a-text)] tracking-tight">IAE<span className="text-[var(--a-accent)]">.</span></span>
                    <p className="text-[var(--a-muted)] mt-2 text-sm">Painel Administrativo</p>
                </div>

                <div className="bg-[var(--a-surface)] rounded-[28px] p-8">
                    <h1 className="text-xl font-bold text-[var(--a-text)] mb-6">Entrar</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--a-muted)] mb-2">E-mail</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="seu@email.com"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-[var(--a-input-bg)] border border-transparent rounded-2xl text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40 transition-all disabled:opacity-60"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--a-muted)] mb-2">Senha</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-[var(--a-input-bg)] border border-transparent rounded-2xl text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40 transition-all disabled:opacity-60"
                            />
                        </div>

                        {error && (
                            <p className="text-sm font-semibold text-[var(--a-danger)]">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[var(--a-accent)] hover:bg-[var(--a-accent-hover)] text-[var(--a-accent-contrast)] py-3 rounded-full font-bold transition-colors disabled:opacity-60"
                        >
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
