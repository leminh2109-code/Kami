import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-parchment min-h-screen">
      <AdminSidebar />
      <main className="flex-1 px-10 py-8">{children}</main>
    </div>
  );
}
