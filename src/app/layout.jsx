import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '../providers/QueryProvider.jsx';
import AdminShell from '../components/AdminShell.jsx';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'Maza Printwala — Admin Control Panel',
  description: 'Management console for catalogue, pricing, artwork QC, and orders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        {/* Anti-flash inline script to apply dark class before render */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.theme;var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}`,
          }}
        />
      </head>
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
