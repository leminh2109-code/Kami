"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, ORDER_STATUS_ORDER, formatVND } from "@/lib/labels";

type Customer = { id: string; code: string; name: string };
type Product = { id: string; code: string; name: string };
type Workshop = { id: string; code: string; name: string };
type QuoteRequest = { id: string; companyName: string; createdAt: string };

type Item = {
  key: number;
  productId: string;
  customName: string;
  quantity: number;
  unitPrice: number;
  note: string;
};

let keyCounter = 0;
function newItem(): Item {
  return { key: ++keyCounter, productId: "", customName: "", quantity: 1, unitPrice: 0, note: "" };
}

export default function OrderForm({
  customers,
  products,
  workshops,
  quotes,
  defaultCode,
}: {
  customers: Customer[];
  products: Product[];
  workshops: Workshop[];
  quotes: QuoteRequest[];
  defaultCode: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[]>([newItem()]);
  const [depositAmount, setDepositAmount] = useState(0);

  const totalAmount = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
  const remaining = totalAmount - depositAmount;

  function updateItem(key: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  }

  function removeItem(key: number) {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validItems = items.filter((it) => it.productId || it.customName.trim());
    if (validItems.length === 0) {
      setError("Cần có ít nhất 1 mặt hàng");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      code: form.get("code") as string,
      customerId: form.get("customerId") as string,
      quoteRequestId: (form.get("quoteRequestId") as string) || undefined,
      workshopId: (form.get("workshopId") as string) || undefined,
      status: form.get("status") as string,
      depositAmount,
      totalAmount,
      expectedDelivery: (form.get("expectedDelivery") as string) || undefined,
      assignedTo: form.get("assignedTo") as string,
      internalNote: form.get("internalNote") as string,
      items: validItems.map((it) => ({
        productId: it.productId || undefined,
        customName: it.productId ? "" : it.customName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        note: it.note,
      })),
    };

    const res = await fetch("/api/admin/orders", {
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

    const order = await res.json();
    router.push(`/admin/orders/${order.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Thông tin chung */}
      <section className="space-y-5">
        <h2 className="text-base font-medium border-b border-line pb-2">Thông tin đơn hàng</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Mã đơn hàng *" name="code" defaultValue={defaultCode} required />
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1.5">Khách hàng *</label>
            <select name="customerId" required className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
              <option value="">-- Chọn khách hàng --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm mb-1.5">Trạng thái</label>
            <select name="status" defaultValue="DAT_COC" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
              {ORDER_STATUS_ORDER.filter((s) => s !== "HUY").map((s) => (
                <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1.5">Người phụ trách</label>
            <input name="assignedTo" type="text" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring" />
          </div>
          <div>
            <label className="block text-sm mb-1.5">Hạn giao hàng</label>
            <input name="expectedDelivery" type="date" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm mb-1.5">Xưởng gia công</label>
            <select name="workshopId" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
              <option value="">-- Chưa chọn --</option>
              {workshops.map((w) => (
                <option key={w.id} value={w.id}>{w.code} — {w.name}</option>
              ))}
            </select>
          </div>
          {quotes.length > 0 && (
            <div>
              <label className="block text-sm mb-1.5">Liên kết từ báo giá</label>
              <select name="quoteRequestId" className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring">
                <option value="">-- Không liên kết --</option>
                {quotes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.companyName} — {new Date(q.createdAt).toLocaleDateString("vi-VN")}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Mặt hàng */}
      <section className="space-y-3">
        <h2 className="text-base font-medium border-b border-line pb-2">Mặt hàng</h2>

        <div className="border border-line">
          <div className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_auto] gap-0 text-xs text-ink/50 bg-line/20 border-b border-line">
            {["Sản phẩm / tên mặt hàng", "SL", "Đơn giá (đ)", "Thành tiền", ""].map((h) => (
              <div key={h} className="px-3 py-2 font-medium">{h}</div>
            ))}
          </div>

          {items.map((item) => (
            <div key={item.key} className="grid grid-cols-[2fr_1fr_1.5fr_1.5fr_auto] border-b border-line last:border-0">
              <div className="px-2 py-2 space-y-1">
                <select
                  className="w-full border border-line bg-white px-2 py-1 text-sm focus-ring"
                  value={item.productId}
                  onChange={(e) => updateItem(item.key, { productId: e.target.value, customName: "" })}
                >
                  <option value="">Mặt hàng khác...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
                  ))}
                </select>
                {!item.productId && (
                  <input
                    type="text"
                    placeholder="Tên mặt hàng *"
                    value={item.customName}
                    onChange={(e) => updateItem(item.key, { customName: e.target.value })}
                    className="w-full border border-line bg-white px-2 py-1 text-sm focus-ring"
                  />
                )}
                <input
                  type="text"
                  placeholder="Ghi chú"
                  value={item.note}
                  onChange={(e) => updateItem(item.key, { note: e.target.value })}
                  className="w-full border border-dashed border-line bg-white px-2 py-1 text-xs focus-ring text-ink/60"
                />
              </div>
              <div className="px-2 py-2">
                <input
                  type="number" min={1} value={item.quantity}
                  onChange={(e) => updateItem(item.key, { quantity: Number(e.target.value) })}
                  className="w-full border border-line bg-white px-2 py-2 text-sm focus-ring"
                />
              </div>
              <div className="px-2 py-2">
                <input
                  type="number" min={0} step={1000} value={item.unitPrice}
                  onChange={(e) => updateItem(item.key, { unitPrice: Number(e.target.value) })}
                  className="w-full border border-line bg-white px-2 py-2 text-sm focus-ring"
                />
              </div>
              <div className="px-3 py-2 flex items-center text-sm text-ink/70">
                {formatVND(item.quantity * item.unitPrice)}
              </div>
              <div className="px-2 py-2 flex items-start">
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  disabled={items.length === 1}
                  className="text-ink/30 hover:text-red-600 text-lg leading-none disabled:invisible"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, newItem()])}
          className="text-sm text-brass-dark hover:underline focus-ring"
        >
          + Thêm mặt hàng
        </button>
      </section>

      {/* Tài chính */}
      <section className="space-y-4">
        <h2 className="text-base font-medium border-b border-line pb-2">Tài chính</h2>
        <div className="grid sm:grid-cols-3 gap-5 items-end">
          <div>
            <p className="text-sm mb-1.5 text-ink/60">Tổng giá trị (tự tính)</p>
            <p className="text-lg font-display">{formatVND(totalAmount)}</p>
          </div>
          <div>
            <label className="block text-sm mb-1.5">Đặt cọc (đ)</label>
            <input
              type="number" min={0} step={1000} value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
            />
          </div>
          <div>
            <p className="text-sm mb-1.5 text-ink/60">Còn lại</p>
            <p className={`text-lg font-display ${remaining < 0 ? "text-red-700" : ""}`}>
              {formatVND(remaining)}
            </p>
          </div>
        </div>
      </section>

      {/* Ghi chú */}
      <section className="space-y-2">
        <h2 className="text-base font-medium border-b border-line pb-2">Ghi chú nội bộ</h2>
        <textarea
          name="internalNote"
          rows={3}
          placeholder="Ghi chú nội bộ, yêu cầu đặc biệt..."
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        />
      </section>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-ink px-6 py-2.5 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : "Tạo đơn hàng"}
      </button>
    </form>
  );
}

function Field({ label, name, defaultValue, required }: {
  label: string; name: string; defaultValue?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm mb-1.5">{label}</label>
      <input
        name={name} required={required} defaultValue={defaultValue}
        className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
      />
    </div>
  );
}
