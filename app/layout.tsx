import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from '@/lib/registry';
import ThemeProvider from '@/components/providers/ThemeProvider';
import LenisProvider from '@/components/providers/LenisProvider';
import IntroLoader from '@/components/ui/IntroLoader';

const displayFont = Cormorant_Garamond({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const bodyFont = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lakshitha — AI Native Product Designer',
  description:
    'AI Native Digital Product Designer & UX Strategist based in Colombo, Sri Lanka. I design products for humans.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <IntroLoader />
            <LenisProvider>{children}</LenisProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
