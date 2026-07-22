"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Đăng nhập thất bại");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="text-brass text-xs uppercase tracking-[0.2em] mb-2">
          KAMI · Quản trị
        </p>
        <h1 className="font-display text-2xl text-parchment mb-8">
          Đăng nhập
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-parchment/70 mb-1.5">
              Tên đăng nhập
            </label>
            <input
              name="username"
              required
              className="w-full bg-transparent border border-parchment/30 px-3 py-2 text-parchment text-sm focus-ring"
            />
          </div>
          <div>
            <label className="block text-sm text-parchment/70 mb-1.5">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-transparent border border-parchment/30 px-3 py-2 text-parchment text-sm focus-ring"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-brass text-brass py-2.5 text-sm hover:bg-brass hover:text-ink transition-colors focus-ring disabled:opacity-50"
          >
            {loading ? "Đang kiểm tra..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
