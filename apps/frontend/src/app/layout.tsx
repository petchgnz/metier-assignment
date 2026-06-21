import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/provider';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Blogs Blogs',
  description: 'Blogs website assignment - Phummarin Rojanamarn',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
      )}
    >
      <body className='min-h-full flex flex-col'>
        <Providers>
          {children}
          <Toaster richColors position='top-right' duration={3000}/>
        </Providers>
      </body>
    </html>
  );
}
