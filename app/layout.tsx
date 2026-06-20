import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoundSelf - Spotify Personality Analyzer',
  description: 'Your music. Your identity. Decoded.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen relative font-body text-white">
        <div className="noise-overlay z-50 mix-blend-overlay"></div>
        {children}
      </body>
    </html>
  );
}
