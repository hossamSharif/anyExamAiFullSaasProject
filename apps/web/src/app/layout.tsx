import type { Metadata } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import './globals.css';
import { RTLProvider } from './providers/RTLProvider';
import { SolitoProvider } from './providers/SolitoProvider';
import { TamaguiProvider } from '@anyexamai/ui';

// Load Cairo font for headings
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

// Load Tajawal font for body text
const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-tajawal',
  weight: ['200', '300', '400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'anyExamAi - امتحانات ذكية بالعربية',
  description: 'إنشاء امتحانات مخصصة باستخدام الذكاء الاصطناعي - Create custom exams using AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${tajawal.variable}`}>
      <body>
        <TamaguiProvider>
          <SolitoProvider>
            <RTLProvider>{children}</RTLProvider>
          </SolitoProvider>
        </TamaguiProvider>
      </body>
    </html>
  );
}
