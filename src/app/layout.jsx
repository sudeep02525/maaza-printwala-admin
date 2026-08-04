import './globals.css';
import QueryProvider from '../providers/QueryProvider.jsx';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';
import AdminHeader from '../components/layout/AdminHeader.jsx';

export const metadata = {
  title: 'Maza Printwala — Admin Control Panel',
  description: 'Management console for dynamic product catalogue, pricing rules, artwork QC, and orders.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex">
        <QueryProvider>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-h-screen min-w-0">
            <AdminHeader />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
