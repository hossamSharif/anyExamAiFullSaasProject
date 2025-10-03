import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { RTLProvider } from './providers/RTLProvider';

// Load Cairo font for Arabic support
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
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
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>
        <RTLProvider>{children}</RTLProvider>
      </body>
    </html>
  );
}
