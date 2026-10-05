import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: 'light' | 'dark';
};

type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: Theme;
    forcedTheme?: string;
    attribute?: 'class';
    enableSystem?: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
    children,
    defaultTheme = 'system',
    enableSystem = true,
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
            ? savedTheme
            : defaultTheme;
    });
    const [system, setSystem] = useState<'light' | 'dark'>(systemTheme);
    const resolvedTheme = theme === 'system' && enableSystem ? system : theme === 'dark' ? 'dark' : 'light';

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const syncSystem = () => setSystem(media.matches ? 'dark' : 'light');

        media.addEventListener('change', syncSystem);
        return () => media.removeEventListener('change', syncSystem);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
        document.documentElement.style.colorScheme = resolvedTheme;
    }, [resolvedTheme]);

    const value = useMemo<ThemeContextValue>(
        () => ({
            theme,
            resolvedTheme,
            setTheme: (nextTheme) => {
                localStorage.setItem('theme', nextTheme);
                setThemeState(nextTheme);
            },
        }),
        [resolvedTheme, theme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }

    return context;
}
