"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Bell, Mail, MessageSquareText, Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/components/admin/AdminThemeProvider';

const SEEN_KEY = 'iae_admin_leads_seen_at';

interface Lead {
    id: number;
    name: string | null;
    email: string;
    subject: string | null;
    course: string | null;
    message: string | null;
    source: string;
    createdAt: string;
}

interface AdminHeaderProps {
    title: string;
    onMenuClick: () => void;
    leads: Lead[];
    onViewAllLeads: () => void;
}

function timeAgo(dateString: string): string {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `há ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return `há ${days}d`;
}

export default function AdminHeader({ title, onMenuClick, leads, onViewAllLeads }: AdminHeaderProps) {
    const { theme, toggleTheme } = useAdminTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [lastSeenAt, setLastSeenAt] = useState<number>(() => {
        if (typeof window === 'undefined') return 0;
        try {
            return Number(localStorage.getItem(SEEN_KEY)) || 0;
        } catch {
            return 0;
        }
    });
    const panelRef = useRef<HTMLDivElement>(null);

    const recentLeads = useMemo(() => {
        return [...leads]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 6);
    }, [leads]);

    const unreadCount = useMemo(() => {
        return leads.filter((l) => new Date(l.createdAt).getTime() > lastSeenAt).length;
    }, [leads, lastSeenAt]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen((prev) => {
            const next = !prev;
            if (next) {
                const now = Date.now();
                setLastSeenAt(now);
                try {
                    localStorage.setItem(SEEN_KEY, String(now));
                } catch {
                    // localStorage indisponível (modo privado, etc.) — segue sem persistir
                }
            }
            return next;
        });
    };

    return (
        <header className="h-20 flex items-center justify-between px-4 md:px-8 shrink-0 relative">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-[var(--a-text)] p-2 -ml-2 rounded-full hover:bg-[var(--a-text)]/5 shrink-0"
                    aria-label="Abrir menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-lg md:text-xl font-bold text-[var(--a-text)] truncate">{title}</h1>
            </div>
            <div className="flex items-center gap-3 shrink-0" ref={panelRef}>
                <button
                    onClick={toggleTheme}
                    className="w-11 h-11 rounded-full bg-[var(--a-surface)] flex items-center justify-center text-[var(--a-muted)] hover:text-[var(--a-accent)] transition-colors"
                    aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
                    title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <div className="relative">
                    <button
                        onClick={handleToggle}
                        className="relative w-11 h-11 rounded-full bg-[var(--a-surface)] flex items-center justify-center text-[var(--a-muted)] hover:text-[var(--a-accent)] transition-colors"
                        aria-label="Notificações"
                        aria-expanded={isOpen}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--a-accent)] text-[var(--a-accent-contrast)] text-[10px] font-bold flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-3 w-[340px] max-w-[calc(100vw-2rem)] bg-[var(--a-surface)] rounded-[24px] shadow-2xl overflow-hidden z-50 animate-[dropdown-in_0.15s_ease-out]">
                            <div className="px-5 py-4 flex items-center justify-between">
                                <h3 className="font-bold text-[var(--a-text)] text-sm">Contatos recebidos</h3>
                                {leads.length > 0 && (
                                    <span className="text-xs text-[var(--a-faint)]">{leads.length} no total</span>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto px-2 pb-2 space-y-1">
                                {recentLeads.length === 0 ? (
                                    <div className="px-4 py-8 text-center">
                                        <Mail className="w-6 h-6 text-[var(--a-faint)] mx-auto mb-2" />
                                        <p className="text-sm text-[var(--a-muted)]">Nenhum contato recebido ainda.</p>
                                    </div>
                                ) : (
                                    recentLeads.map((lead) => {
                                        const isNew = new Date(lead.createdAt).getTime() > lastSeenAt - 1;
                                        return (
                                            <div key={lead.id} className="px-3 py-3 rounded-2xl hover:bg-[var(--a-text)]/5 transition-colors flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[var(--a-text)]/5 flex items-center justify-center text-[var(--a-accent)] shrink-0 mt-0.5">
                                                    <MessageSquareText className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-semibold text-[var(--a-text)] truncate">{lead.name || lead.email}</p>
                                                        {isNew && <span className="w-1.5 h-1.5 rounded-full bg-[var(--a-accent)] shrink-0" />}
                                                    </div>
                                                    <p className="text-xs text-[var(--a-muted)] truncate">{lead.subject || lead.course || lead.message || lead.email}</p>
                                                    <p className="text-[11px] text-[var(--a-faint)] mt-0.5">{timeAgo(lead.createdAt)}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <button
                                onClick={() => { setIsOpen(false); onViewAllLeads(); }}
                                className="w-full text-center text-sm font-semibold text-[var(--a-accent)] hover:bg-[var(--a-text)]/5 py-3.5 transition-colors"
                            >
                                Ver todos os contatos
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                @keyframes dropdown-in {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
}
