import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-parchment min-h-screen">
      <AdminSidebar />
      {/* pt-14 on mobile to clear fixed top bar; lg:pt-0 restores normal desktop padding */}
      <main className="flex-1 px-4 py-6 pt-20 lg:px-10 lg:py-8 lg:pt-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
