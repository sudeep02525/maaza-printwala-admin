import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import QueryProvider from '../providers/QueryProvider.jsx';
import AdminShell from '../components/AdminShell.jsx';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'Maza Printwala — Admin Control Panel',
  description: 'Management console for catalogue, pricing, artwork QC, and orders.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;
  const isDark = theme === 'dark';

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${isDark ? 'dark' : ''}`}>
      <body className="text-[var(--text-main)] font-sans antialiased h-screen overflow-hidden flex bg-[var(--bg-page)] transition-colors">
        <QueryProvider>
          <AdminShell>{children}</AdminShell>
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border)] shadow-md text-xs',
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
