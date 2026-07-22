"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/customers", label: "Khách hàng" },
  { href: "/admin/workshops", label: "Xưởng gia công" },
  { href: "/admin/finance", label: "Tài chính" },
  { href: "/admin/finance/debt", label: "Công nợ" },
  { href: "/admin/quotes", label: "Báo giá" },
  { href: "/admin/products", label: "Sản phẩm" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  const navLinks = (
    <nav className="space-y-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "block px-3 py-2.5 text-sm focus-ring rounded-sm",
            isActive(item.href)
              ? "bg-ink text-parchment"
              : "text-ink/70 hover:bg-line/60"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-parchment border-b border-line flex items-center justify-between px-4">
        <Link href="/admin">
          <Image
            src="/kami-logo.jpg"
            alt="KAMI"
            width={90}
            height={45}
            className="h-9 w-auto object-contain mix-blend-multiply"
            priority
          />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 -mr-1 focus-ring"
          aria-label="Mở menu"
        >
          <span className="block w-5 h-0.5 bg-ink mb-1.5" />
          <span className="block w-5 h-0.5 bg-ink mb-1.5" />
          <span className="block w-4 h-0.5 bg-ink" />
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Drawer */}
          <div className="w-64 bg-parchment border-r border-line h-full flex flex-col justify-between py-8 px-5 shadow-xl">
            <div>
              <Image
                src="/kami-logo.jpg"
                alt="KAMI"
                width={100}
                height={50}
                className="h-11 w-auto object-contain mix-blend-multiply mb-8"
              />
              {navLinks}
            </div>
            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 text-sm text-ink/50 hover:text-ink focus-ring"
            >
              Đăng xuất
            </button>
          </div>
          {/* Backdrop */}
          <div
            className="flex-1 bg-ink/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-56 shrink-0 border-r border-line min-h-screen py-8 px-5 flex-col justify-between">
        <div>
          <Image
            src="/kami-logo.jpg"
            alt="KAMI"
            width={100}
            height={50}
            className="h-12 w-auto object-contain mix-blend-multiply mb-8"
          />
          {navLinks}
        </div>
        <button
          onClick={handleLogout}
          className="text-left px-3 py-2 text-sm text-ink/50 hover:text-ink focus-ring"
        >
          Đăng xuất
        </button>
      </aside>
    </>
  );
}
