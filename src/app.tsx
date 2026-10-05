import './bootstrap';
import './css/app.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RootApp from './RootApp';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('React root element was not found.');
}

createRoot(rootElement).render(
    <StrictMode>
        <RootApp />
    </StrictMode>,
);
