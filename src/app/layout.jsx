import './globals.css';
import QueryProvider from '../providers/QueryProvider.jsx';
import AdminShell from '../components/AdminShell.jsx';

export const metadata = {
  title: 'Maza Printwala — Admin Control Panel',
  description: 'Management console for catalogue, pricing, artwork QC, and orders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="neu-flat text-slate-700 font-sans antialiased min-h-screen flex">
        <QueryProvider>
          <AdminShell>{children}</AdminShell>
        </QueryProvider>
      </body>
    </html>
  );
}
