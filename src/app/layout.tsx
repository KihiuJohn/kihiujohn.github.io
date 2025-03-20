import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'John Kihiu | Full Stack Developer',
  description: 'Portfolio website of John Kihiu, a skilled Full Stack Developer specializing in Laravel, React, Tailwind CSS, and more.',
  keywords: ['John Kihiu', 'Full Stack Developer', 'Laravel', 'React', 'Tailwind CSS', 'JavaScript', 'PHP'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
