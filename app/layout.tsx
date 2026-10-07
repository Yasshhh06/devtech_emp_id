import '../src/lib/ssr-polyfill';
import './globals.css';

export const metadata = {
  title: 'DevTech IT Solutions - Smart Employee ID System',
  description: 'Production-ready HR Employee ID Card Management & Public Verification System for DevTech IT Solutions',
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-devtech-500 selection:text-white font-sans min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
