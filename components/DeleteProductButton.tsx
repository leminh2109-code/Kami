"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Xoá sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) router.refresh();
    else alert("Không xoá được sản phẩm");
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-700 hover:underline focus-ring disabled:opacity-50"
    >
      {loading ? "Đang xoá..." : "Xoá"}
    </button>
  );
}
