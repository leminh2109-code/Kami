"use client";

import { useState } from "react";

type Product = { id: string; name: string; code: string };

export default function QuoteForm({
  products,
  preselectedProductId,
}: {
  products: Product[];
  preselectedProductId?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const payload = {
      companyName: form.get("companyName"),
      contactName: form.get("contactName"),
      phone: form.get("phone"),
      email: form.get("email"),
      organizationType: form.get("organizationType"),
      message: form.get("message"),
      productId: form.get("productId") || undefined,
      quantity: form.get("quantity") ? Number(form.get("quantity")) : undefined,
    };

    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Không gửi được yêu cầu");
      }
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "done") {
    return (
      <div className="border border-brass/50 p-6">
        <p className="font-display text-xl mb-1">Đã gửi yêu cầu</p>
        <p className="text-sm text-ink/70">
          Cảm ơn bạn. Chúng tôi đã nhận được yêu cầu báo giá và sẽ liên hệ
          lại sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Tên đơn vị / tổ chức" name="companyName" required />
        <Field label="Người liên hệ" name="contactName" required />
        <Field label="Số điện thoại" name="phone" required type="tel" />
        <Field label="Email" name="email" required type="email" />
      </div>

      <div>
        <label className="block text-sm mb-1.5">Loại hình đơn vị</label>
        <select
          name="organizationType"
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          defaultValue=""
        >
          <option value="">Chọn loại hình (không bắt buộc)</option>
          <option value="Cơ quan nhà nước">Cơ quan nhà nước</option>
          <option value="Tổ chức / hiệp hội">Tổ chức / hiệp hội</option>
          <option value="Doanh nghiệp">Doanh nghiệp</option>
          <option value="Khác">Khác</option>
        </select>
      </div>

      {products.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1.5">Sản phẩm quan tâm</label>
            <select
              name="productId"
              defaultValue={preselectedProductId ?? ""}
              className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
            >
              <option value="">Chưa xác định / nhiều sản phẩm</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <Field label="Số lượng dự kiến" name="quantity" type="number" min={1} />
        </div>
      )}

      <div>
        <label className="block text-sm mb-1.5">Yêu cầu chi tiết</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Mô tả mẫu mã mong muốn, ngân sách, thời gian cần giao hàng..."
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring disabled:opacity-50"
      >
        {status === "loading" ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  min,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  min?: number;
}) {
  return (
    <div>
      <label className="block text-sm mb-1.5">
        {label}
        {required && <span className="text-brass-dark"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
      />
    </div>
  );
}
