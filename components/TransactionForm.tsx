"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CustomerOption = { id: string; code: string; name: string };
type WorkshopOption = { id: string; code: string; name: string };
type OrderOption = { id: string; code: string; customer: { name: string } };

const THU_CATEGORIES = [
  { value: "THU_KHACH_HANG", label: "Thu từ khách hàng" },
  { value: "KHAC", label: "Thu khác" },
];

const CHI_CATEGORIES = [
  { value: "CHI_XUONG", label: "Thanh toán xưởng" },
  { value: "CHI_NGUYEN_LIEU", label: "Chi nguyên liệu" },
  { value: "CHI_VAN_HANH", label: "Chi vận hành" },
  { value: "KHAC", label: "Chi khác" },
];

export default function TransactionForm({
  customers,
  workshops,
  orders,
  defaultCode,
}: {
  customers: CustomerOption[];
  workshops: WorkshopOption[];
  orders: OrderOption[];
  defaultCode: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState<"THU" | "CHI">("THU");
  const [category, setCategory] = useState("THU_KHACH_HANG");

  function handleTypeChange(newType: "THU" | "CHI") {
    setType(newType);
    setCategory(newType === "THU" ? "THU_KHACH_HANG" : "CHI_XUONG");
  }

  const categories = type === "THU" ? THU_CATEGORIES : CHI_CATEGORIES;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      code: form.get("code") as string,
      type,
      category,
      amount: Number(form.get("amount")),
      date: form.get("date") as string,
      description: form.get("description") as string,
      orderId: (form.get("orderId") as string) || undefined,
      customerId: (form.get("customerId") as string) || undefined,
      workshopId: (form.get("workshopId") as string) || undefined,
    };

    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Có lỗi xảy ra");
      return;
    }

    router.push("/admin/finance/transactions");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Loại giao dịch */}
      <div>
        <p className="text-sm mb-2">Loại *</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange("THU")}
            className={`px-5 py-2 text-sm border transition-colors ${
              type === "THU"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "border-line text-ink/70 hover:border-ink"
            }`}
          >
            Thu
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("CHI")}
            className={`px-5 py-2 text-sm border transition-colors ${
              type === "CHI"
                ? "bg-red-700 text-white border-red-700"
                : "border-line text-ink/70 hover:border-ink"
            }`}
          >
            Chi
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm mb-1.5">Mã phiếu *</label>
          <input
            name="code"
            required
            defaultValue={defaultCode}
            className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5">Danh mục *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm mb-1.5">Số tiền (đ) *</label>
          <input
            name="amount"
            type="number"
            min={0}
            step={1000}
            required
            className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="block text-sm mb-1.5">Ngày *</label>
          <input
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1.5">Diễn giải</label>
        <input
          name="description"
          type="text"
          placeholder="Mô tả ngắn về giao dịch..."
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        />
      </div>

      {/* Liên kết */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm mb-1.5">Liên kết đơn hàng</label>
          <select name="orderId" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
            <option value="">-- Không liên kết --</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.code} — {o.customer.name}
              </option>
            ))}
          </select>
        </div>
        {type === "THU" ? (
          <div>
            <label className="block text-sm mb-1.5">Khách hàng</label>
            <select name="customerId" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
              <option value="">-- Không chọn --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : category === "CHI_XUONG" ? (
          <div>
            <label className="block text-sm mb-1.5">Xưởng gia công</label>
            <select name="workshopId" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
              <option value="">-- Không chọn --</option>
              {workshops.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code} — {w.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-ink px-6 py-2.5 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : "Ghi phiếu"}
      </button>
    </form>
  );
}
