import { useEffect, useState } from 'react';

function currentPathname() {
    return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function usePathname() {
    const [pathname, setPathname] = useState(currentPathname);

    useEffect(() => {
        const syncPathname = () => setPathname(currentPathname());

        window.addEventListener('popstate', syncPathname);
        return () => window.removeEventListener('popstate', syncPathname);
    }, []);

    return pathname;
}

export function notFound(): never {
    const error = new Error('Route not found');
    error.name = 'NotFoundError';
    throw error;
}
