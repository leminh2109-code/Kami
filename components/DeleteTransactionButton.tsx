"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTransactionButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Xoá phiếu giao dịch này?")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/transactions/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-600 hover:underline disabled:opacity-40 focus-ring"
    >
      {loading ? "..." : "Xoá"}
    </button>
  );
}
