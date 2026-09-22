"use client";

import React from 'react';
import { LayoutDashboard, Newspaper, Users, Inbox, CalendarDays, LogOut, X } from 'lucide-react';

export type AdminView = 'dashboard' | 'list' | 'create' | 'users' | 'createUser' | 'leads' | 'agenda' | 'createAgenda';

interface NavItem {
    id: AdminView;
    matches: AdminView[];
    label: string;
    icon: React.ElementType;
    badge?: number;
}

interface AdminSidebarProps {
    currentView: AdminView;
    onNavigate: (view: AdminView) => void;
    onLogout: () => void;
    leadsCount: number;
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

export default function AdminSidebar({ currentView, onNavigate, onLogout, leadsCount, isOpen, onClose, userEmail }: AdminSidebarProps) {
    const navItems: NavItem[] = [
        { id: 'dashboard', matches: ['dashboard'], label: 'Dashboard', icon: LayoutDashboard },
        { id: 'list', matches: ['list', 'create'], label: 'Gestão do Blog', icon: Newspaper },
        { id: 'users', matches: ['users', 'createUser'], label: 'Usuários', icon: Users },
        { id: 'leads', matches: ['leads'], label: 'Contatos', icon: Inbox, badge: leadsCount },
        { id: 'agenda', matches: ['agenda', 'createAgenda'], label: 'Agenda', icon: CalendarDays },
    ];

    const content = (
        <>
            <div className="h-20 flex items-center justify-between px-6 shrink-0">
                <span className="text-xl font-extrabold text-[var(--a-sidebar-text)] tracking-tight">IAE<span className="text-[var(--a-sidebar-muted)]">.</span></span>
                <button onClick={onClose} className="md:hidden text-[var(--a-sidebar-muted)] hover:text-[var(--a-sidebar-text)] p-1" aria-label="Fechar menu">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const active = item.matches.includes(currentView);
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors text-left ${active
                                    ? 'bg-[var(--a-sidebar-active-bg)] text-[var(--a-sidebar-active-text)] font-semibold'
                                    : 'text-[var(--a-sidebar-muted)] hover:bg-[var(--a-sidebar-hover-bg)] hover:text-[var(--a-sidebar-text)]'
                                }`}
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            <span className="truncate text-sm">{item.label}</span>
                            {!!item.badge && item.badge > 0 && (
                                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-[var(--a-sidebar-active-bg)] text-[var(--a-sidebar-active-text)]' : 'bg-[var(--a-sidebar-badge-bg)] text-[var(--a-sidebar-text)]'}`}>{item.badge}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 shrink-0 space-y-1">
                <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-[var(--a-sidebar-hover-bg)]">
                    <div className="w-9 h-9 rounded-full bg-[var(--a-sidebar-avatar-bg)] flex items-center justify-center text-[var(--a-sidebar-avatar-text)] font-bold text-sm shrink-0">A</div>
                    <div className="text-sm min-w-0">
                        <p className="text-[var(--a-sidebar-text)] font-semibold truncate">Admin</p>
                        <p className="text-xs text-[var(--a-sidebar-faint)] truncate">{userEmail || 'admin@iae.com.br'}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--a-sidebar-muted)] hover:bg-[var(--a-sidebar-hover-bg)] hover:text-[var(--a-sidebar-text)] transition-colors text-left"
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span className="text-sm">Sair</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed md:static inset-y-0 left-0 w-72 md:w-64 bg-[var(--a-sidebar-bg)] flex flex-col z-40 shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                {content}
            </aside>
        </>
    );
}
