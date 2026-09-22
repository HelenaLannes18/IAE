"use client";

import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'iae_admin_theme';

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === 'dark' ? 'dark' : 'light';
    } catch {
        return 'light';
    }
}

export default function AdminThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(readStoredTheme);

    const toggleTheme = () => {
        setTheme((prev) => {
            const next: Theme = prev === 'light' ? 'dark' : 'light';
            try {
                localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // segue sem persistir
            }
            return next;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className="admin-shell min-h-screen bg-[var(--a-bg)] text-[var(--a-text)]" data-theme={theme} suppressHydrationWarning>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useAdminTheme deve ser usado dentro do AdminThemeProvider');
    return ctx;
}
