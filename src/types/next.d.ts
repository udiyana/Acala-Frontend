declare module 'next' {
    export type Metadata = {
        metadataBase?: URL;
        title?: string | { default?: string; template?: string };
        description?: string;
        keywords?: string | string[];
        alternates?: Record<string, unknown>;
        openGraph?: Record<string, unknown>;
        twitter?: Record<string, unknown>;
        robots?: Record<string, unknown> | boolean;
    };
}
