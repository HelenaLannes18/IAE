"use client";

import React from 'react';
import { Search, Inbox } from 'lucide-react';

export function StatCard({ icon: Icon, label, value, variant = 'default' }: { icon: React.ElementType; label: string; value: React.ReactNode; variant?: 'default' | 'highlight' }) {
    if (variant === 'highlight') {
        return (
            <div className="rounded-[28px] p-6 flex flex-col justify-between gap-8 bg-gradient-to-br from-[var(--a-highlight-from)] to-[var(--a-highlight-to)] text-[var(--a-accent-contrast)] min-h-[152px]">
                <div className="w-11 h-11 rounded-2xl bg-[var(--a-accent-contrast)]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-3xl font-extrabold tracking-tight">{value}</p>
                    <p className="text-sm font-medium text-[var(--a-accent-contrast)]/70 mt-1">{label}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6 flex flex-col justify-between gap-8 min-h-[152px] transition-colors hover:bg-[var(--a-text)]/[0.03]">
            <div className="w-11 h-11 rounded-2xl bg-[var(--a-text)]/5 flex items-center justify-center text-[var(--a-accent)] shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-3xl font-extrabold text-[var(--a-text)] tracking-tight">{value}</p>
                <p className="text-sm font-medium text-[var(--a-muted)] mt-1">{label}</p>
            </div>
        </div>
    );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="relative w-full sm:w-96 group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--a-muted)] group-focus-within:text-[var(--a-accent)] transition-colors" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--a-surface)] border border-[var(--a-border)] rounded-full text-sm text-[var(--a-text)] placeholder:text-[var(--a-faint)] focus:outline-none focus:border-[var(--a-accent)]/40 transition-all"
            />
        </div>
    );
}

export function StatusBadge({ status, activeValue = 'Publicado' }: { status: string; activeValue?: string }) {
    const isActive = status === activeValue;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${isActive ? 'bg-[var(--a-accent)]/15 text-[var(--a-accent)]' : 'bg-[var(--a-text)]/5 text-[var(--a-muted)]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[var(--a-accent)]' : 'bg-[var(--a-faint)]'}`} />
            {status}
        </span>
    );
}

export function EmptyState({ icon: Icon = Inbox, title, description }: { icon?: React.ElementType; title: string; description?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--a-text)]/5 flex items-center justify-center text-[var(--a-muted)] mb-1">
                <Icon className="w-6 h-6" />
            </div>
            <p className="font-semibold text-[var(--a-text)]">{title}</p>
            {description && <p className="text-sm text-[var(--a-muted)] max-w-sm">{description}</p>}
        </div>
    );
}

export function Avatar({ src, name, size = 9 }: { src?: string | null; name?: string; size?: number }) {
    const px = `${size * 4}px`;
    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={name || ''}
                title={name}
                style={{ width: px, height: px }}
                className="rounded-full object-cover shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }}
            />
        );
    }
    return (
        <div
            title={name}
            style={{ width: px, height: px }}
            className="rounded-full bg-[var(--a-accent)] flex items-center justify-center text-[var(--a-accent-contrast)] font-bold shrink-0"
        >
            <span style={{ fontSize: `${Math.max(size * 1.1, 10)}px` }}>{name ? name.charAt(0).toUpperCase() : '?'}</span>
        </div>
    );
}

export function ThumbBox({ src }: { src?: string | null }) {
    const cls = `w-11 h-11 rounded-2xl object-cover shrink-0 bg-[var(--a-text)]/5`;
    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className={cls} onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
        );
    }
    return <div className={cls} />;
}

export function IconActionButton({ onClick, title, variant = 'default', children }: { onClick: () => void; title: string; variant?: 'default' | 'danger'; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2.5 rounded-full transition-colors ${variant === 'danger'
                    ? 'text-[var(--a-muted)] hover:text-[var(--a-danger)] hover:bg-[var(--a-danger)]/10'
                    : 'text-[var(--a-muted)] hover:text-[var(--a-accent)] hover:bg-[var(--a-text)]/5'
                }`}
        >
            {children}
        </button>
    );
}

export function ListShell({ children, empty }: { children: React.ReactNode; empty?: boolean }) {
    return (
        <div className={`bg-[var(--a-surface-2)] rounded-[28px] ${empty ? '' : 'p-3'}`}>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-[var(--a-surface-2)] rounded-[28px] p-3">
            <div className="flex flex-col gap-2">
                {Array.from({ length: rows }).map((_, r) => (
                    <div key={r} className="rounded-2xl bg-[var(--a-surface)] border border-[var(--a-border)] px-5 py-4 flex items-center gap-4 animate-pulse">
                        <div className="w-11 h-11 rounded-2xl bg-[var(--a-text)]/5 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 rounded-full bg-[var(--a-text)]/5" style={{ width: `${40 + (r % 3) * 15}%` }} />
                            <div className="h-2.5 rounded-full bg-[var(--a-text)]/5 w-1/4" />
                        </div>
                        <div className="h-6 w-20 rounded-full bg-[var(--a-text)]/5 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[var(--a-surface)] border border-[var(--a-border)] rounded-[28px] p-6 min-h-[152px] flex flex-col justify-between gap-8 animate-pulse">
                    <div className="w-11 h-11 rounded-2xl bg-[var(--a-text)]/5" />
                    <div className="space-y-2">
                        <div className="h-7 w-16 rounded-full bg-[var(--a-text)]/5" />
                        <div className="h-3 w-24 rounded-full bg-[var(--a-text)]/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}
