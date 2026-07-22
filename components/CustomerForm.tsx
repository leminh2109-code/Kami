"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CUSTOMER_TYPE_OPTIONS } from "@/lib/labels";

type CustomerData = {
  id?: string;
  code: string;
  name: string;
  type: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  notes: string;
  isActive: boolean;
};

export default function CustomerForm({ initial }: { initial?: CustomerData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      code: form.get("code") as string,
      name: form.get("name") as string,
      type: form.get("type") as string,
      contactName: form.get("contactName") as string,
      phone: form.get("phone") as string,
      email: form.get("email") as string,
      address: form.get("address") as string,
      taxCode: form.get("taxCode") as string,
      notes: form.get("notes") as string,
      isActive: form.get("isActive") === "on",
    };

    const res = await fetch(
      isEdit ? `/api/admin/customers/${initial!.id}` : "/api/admin/customers",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Có lỗi xảy ra");
      return;
    }

    router.push("/admin/customers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Mã khách hàng" name="code" defaultValue={initial?.code} required placeholder="VD: KH-001" />
        <Field label="Tên tổ chức / doanh nghiệp" name="name" defaultValue={initial?.name} required />
      </div>

      <div>
        <label className="block text-sm mb-1.5">Loại tổ chức</label>
        <select
          name="type"
          defaultValue={initial?.type ?? ""}
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        >
          <option value="">-- Chọn loại --</option>
          {CUSTOMER_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Người liên hệ" name="contactName" defaultValue={initial?.contactName} />
        <Field label="Số điện thoại" name="phone" defaultValue={initial?.phone} />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Email" name="email" type="email" defaultValue={initial?.email} />
        <Field label="Mã số thuế" name="taxCode" defaultValue={initial?.taxCode} />
      </div>

      <Field label="Địa chỉ" name="address" defaultValue={initial?.address} />

      <div>
        <label className="block text-sm mb-1.5">Ghi chú nội bộ</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initial?.notes}
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={initial?.isActive ?? true} />
        Khách hàng đang hoạt động
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-ink px-6 py-2.5 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm khách hàng"}
      </button>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = "text", placeholder,
}: {
  label: string; name: string; defaultValue?: string; required?: boolean;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm mb-1.5">
        {label}
        {required && <span className="text-brass-dark"> *</span>}
      </label>
      <input
        name={name} type={type} required={required}
        defaultValue={defaultValue} placeholder={placeholder}
        className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
      />
    </div>
  );
}
