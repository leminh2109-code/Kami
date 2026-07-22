"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/quotes", label: "Yêu cầu báo giá" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-line min-h-screen py-8 px-5 flex flex-col justify-between">
      <div>
        <p className="font-display text-lg mb-8">Kim Ấn</p>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block px-3 py-2 text-sm focus-ring",
                  active ? "bg-ink text-parchment" : "text-ink/70 hover:bg-line/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="text-left px-3 py-2 text-sm text-ink/50 hover:text-ink focus-ring"
      >
        Đăng xuất
      </button>
    </aside>
  );
}
