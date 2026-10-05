import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
    children: ReactNode;
};

function shouldHandleClientSide(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.defaultPrevented || event.button !== 0) {
        return false;
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
        return false;
    }

    const target = event.currentTarget.getAttribute('target');
    if (target && target !== '_self') {
        return false;
    }

    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin && url.protocol.startsWith('http');
}

export default function Link({ href, children, onClick, ...props }: NextLinkProps) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        if (!shouldHandleClientSide(event, href)) {
            return;
        }

        event.preventDefault();

        const url = new URL(href, window.location.href);
        const nextPath = `${url.pathname}${url.search}${url.hash}`;

        if (nextPath !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
            window.history.pushState({}, '', nextPath);
            window.dispatchEvent(new PopStateEvent('popstate'));
        }

        if (url.hash) {
            document.getElementById(url.hash.slice(1))?.scrollIntoView();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}
