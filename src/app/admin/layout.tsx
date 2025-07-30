import AdminNavbar from '../../components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <AdminNavbar />
      {children}
    </section>
  );
}
