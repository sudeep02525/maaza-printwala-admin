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
    <html lang="en" className={`${inter.variable}`}>
      <body className="text-[#111827] font-sans antialiased h-screen overflow-hidden flex bg-[#F5F7F9]">
        <QueryProvider>
          <AdminShell>{children}</AdminShell>
          <Toaster position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
