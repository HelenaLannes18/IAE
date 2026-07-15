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
        <div className="min-h-screen bg-[#16243A] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-3xl font-bold text-[#F3F1EC] tracking-widest">IAE<span className="text-[#9A9186]">.</span></span>
                    <p className="text-[#C7BFB3] mt-2">Painel Administrativo</p>
                </div>

                <div className="bg-[#F3F1EC] rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-xl font-bold text-[#16243A] mb-6">Entrar</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#3A3733] mb-2">E-mail</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="seu@email.com"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-white border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all disabled:opacity-60"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#3A3733] mb-2">Senha</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 bg-white border border-[#C7BFB3] rounded-xl text-[#3A3733] focus:outline-none focus:ring-2 focus:ring-[#16243A]/20 focus:border-[#16243A] transition-all disabled:opacity-60"
                            />
                        </div>

                        {error && (
                            <p className="text-sm font-semibold text-red-600">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#16243A] hover:bg-[#16243A]/90 text-[#F3F1EC] py-3 rounded-xl font-bold shadow-md transition-colors disabled:opacity-60"
                        >
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
