import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteDataProvider } from '@/lib/site-data-store';
import HomePage, { metadata as homeMetadata } from '@/pages/page';
import AboutPage, { metadata as aboutMetadata } from '@/pages/about/page';
import BranchesPage, { metadata as branchesMetadata } from '@/pages/branches/page';
import BranchPage, { getBranchMetadata } from '@/pages/branches/[slug]/page';
import BlogPage, { metadata as blogMetadata } from '@/pages/blog/page';
import BlogPostPage, { getBlogMetadata } from '@/pages/blog/[slug]/page';
import ContactPage, { metadata as contactMetadata } from '@/pages/contact/page';
import GalleryPage, { metadata as galleryMetadata } from '@/pages/gallery/page';
import MenuPage from '@/pages/menu/page';
import CmsPage from '@/pages/cms/page';
import ReservationPage, { metadata as reservationMetadata } from '@/pages/reservation/page';
import NotFoundPage from '@/pages/not-found';
import { getBranchBySlug } from '@/lib/branches';

type PageMetadata = {
    title?: string | { default?: string; template?: string };
    description?: string;
};

const DEFAULT_TITLE = 'Acala Bar & Bistro | Restaurants in Nusa Dua & Nusa Lembongan';
const DEFAULT_DESCRIPTION =
    'Acala Bar & Bistro has two Bali branches: Nusa Dua and Nusa Lembongan.';

const routeMetadata: Record<string, PageMetadata> = {
    '/': homeMetadata,
    '/about': aboutMetadata,
    '/branches': branchesMetadata,
    '/contact': contactMetadata,
    '/gallery': galleryMetadata,
    '/blog': blogMetadata,
    '/menu': {
        title: 'Menu | Acala Bar & Bistro',
        description: 'Explore menu categories for Acala Bar & Bistro branches.',
    },
    '/cms': {
        title: 'CMS | Acala Bar & Bistro',
        description: 'Acala content management system.',
    },
    '/cms/login': {
        title: 'Login CMS | Acala Bar & Bistro',
        description: 'Login ke Acala content management system.',
    },
    '/reservation': reservationMetadata,
};

function getCurrentPath() {
    return window.location.pathname.replace(/\/+$/, '') || '/';
}

function metadataTitle(metadata?: PageMetadata) {
    if (!metadata?.title) {
        return DEFAULT_TITLE;
    }

    if (typeof metadata.title === 'string') {
        return metadata.title.includes('Acala Bar & Bistro')
            ? metadata.title
            : `${metadata.title} | Acala Bar & Bistro`;
    }

    return metadata.title.default ?? DEFAULT_TITLE;
}

function applyMetadata(metadata?: PageMetadata) {
    document.title = metadataTitle(metadata);

    const description = metadata?.description ?? DEFAULT_DESCRIPTION;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
    }

    meta.content = description;
}

function usePathname() {
    const [pathname, setPathname] = useState(getCurrentPath);

    useEffect(() => {
        const syncPathname = () => setPathname(getCurrentPath());

        window.addEventListener('popstate', syncPathname);
        return () => window.removeEventListener('popstate', syncPathname);
    }, []);

    return pathname;
}

function PageForRoute({ pathname }: { pathname: string }) {
    const branchMatch = pathname.match(/^\/branches\/([^/]+)$/);
    const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);

    if (branchMatch) {
        const slug = decodeURIComponent(branchMatch[1]);
        return getBranchBySlug(slug) ? <BranchPage slug={slug} /> : <NotFoundPage />;
    }

    if (blogMatch) {
        return <BlogPostPage slug={decodeURIComponent(blogMatch[1])} />;
    }

    switch (pathname) {
        case '/':
            return <HomePage />;
        case '/about':
            return <AboutPage />;
        case '/branches':
            return <BranchesPage />;
        case '/contact':
            return <ContactPage />;
        case '/gallery':
            return <GalleryPage />;
        case '/blog':
            return <BlogPage />;
        case '/menu':
            return <MenuPage />;
        case '/cms':
            return <CmsPage />;
        case '/cms/login':
            return <CmsPage />;
        case '/reservation':
            return <ReservationPage />;
        default:
            return <NotFoundPage />;
    }
}

export default function App() {
    const pathname = usePathname();
    const isCmsRoute = pathname === '/cms' || pathname.startsWith('/cms/');
    const metadata = useMemo(() => {
        const branchMatch = pathname.match(/^\/branches\/([^/]+)$/);

        if (branchMatch) {
            return getBranchMetadata(decodeURIComponent(branchMatch[1]));
        }

        const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);

        if (blogMatch) {
            return getBlogMetadata(decodeURIComponent(blogMatch[1]));
        }

        return routeMetadata[pathname];
    }, [pathname]);

    useEffect(() => {
        applyMetadata(metadata);
    }, [metadata]);

    return (
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            <div
                className="min-h-screen flex flex-col transition-colors duration-300"
                style={{
                    fontFamily: 'var(--font-body)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-neutral-800)',
                }}
            >
                <SiteDataProvider>
                    {isCmsRoute ? (
                        <PageForRoute pathname={pathname} />
                    ) : (
                        <>
                            <Navbar />
                            <main className="flex-1">
                                <PageForRoute pathname={pathname} />
                            </main>
                            <Footer />
                            <FloatingWhatsApp />
                        </>
                    )}
                </SiteDataProvider>
            </div>
        </ThemeProvider>
    );
}
