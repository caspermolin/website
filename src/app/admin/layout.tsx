import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Posta Vermaas',
  description: 'Admin dashboard for managing website content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
