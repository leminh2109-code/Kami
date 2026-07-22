"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WorkshopData = {
  id?: string;
  code: string;
  name: string;
  contactName: string;
  phone: string;
  address: string;
  specialty: string;
  notes: string;
  isActive: boolean;
};

export default function WorkshopForm({ initial }: { initial: WorkshopData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      code: form.get("code") as string,
      name: form.get("name") as string,
      contactName: form.get("contactName") as string,
      phone: form.get("phone") as string,
      address: form.get("address") as string,
      specialty: form.get("specialty") as string,
      notes: form.get("notes") as string,
      isActive: form.get("isActive") === "true",
    };

    setLoading(true);
    setError("");

    const url = initial.id ? `/api/admin/workshops/${initial.id}` : "/api/admin/workshops";
    const method = initial.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Có lỗi xảy ra");
      return;
    }

    router.push("/admin/workshops");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Mã xưởng *" name="code" defaultValue={initial.code} required />
        <Field label="Tên xưởng *" name="name" defaultValue={initial.name} required />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Người liên hệ" name="contactName" defaultValue={initial.contactName} />
        <Field label="Số điện thoại" name="phone" defaultValue={initial.phone} />
      </div>
      <Field label="Địa chỉ" name="address" defaultValue={initial.address} />
      <Field
        label="Chuyên môn"
        name="specialty"
        defaultValue={initial.specialty}
        placeholder="VD: Nhẫn vàng, Kỷ niệm chương..."
      />
      <div>
        <label className="block text-sm mb-1.5">Ghi chú</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initial.notes}
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5">Trạng thái</label>
        <select
          name="isActive"
          defaultValue={initial.isActive ? "true" : "false"}
          className="border border-line bg-white px-3 py-2 text-sm focus-ring"
        >
          <option value="true">Đang hoạt động</option>
          <option value="false">Ngừng hoạt động</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-ink px-6 py-2.5 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : initial.id ? "Lưu thay đổi" : "Tạo xưởng"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm mb-1.5">{label}</label>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
      />
    </div>
  );
}
