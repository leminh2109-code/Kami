"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, CATEGORY_ORDER, MATERIAL_LABELS } from "@/lib/labels";

const MATERIAL_ORDER = Object.keys(MATERIAL_LABELS);

type ProductData = {
  id?: string;
  code: string;
  name: string;
  category: string;
  material: string;
  description: string;
  imageUrl: string;
  minQuantity: number;
  isCustomizable: boolean;
  isActive: boolean;
};

export default function ProductForm({ initial }: { initial?: ProductData }) {
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
      code: form.get("code"),
      name: form.get("name"),
      category: form.get("category"),
      material: form.get("material"),
      description: form.get("description"),
      imageUrl: form.get("imageUrl"),
      minQuantity: Number(form.get("minQuantity")),
      isCustomizable: form.get("isCustomizable") === "on",
      isActive: form.get("isActive") === "on",
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Có lỗi xảy ra, vui lòng thử lại");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <TextField label="Mã sản phẩm" name="code" defaultValue={initial?.code} required />
        <TextField label="Tên sản phẩm" name="name" defaultValue={initial?.name} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm mb-1.5">Danh mục</label>
          <select
            name="category"
            defaultValue={initial?.category ?? CATEGORY_ORDER[0]}
            className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1.5">Chất liệu</label>
          <select
            name="material"
            defaultValue={initial?.material ?? MATERIAL_ORDER[0]}
            className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
          >
            {MATERIAL_ORDER.map((m) => (
              <option key={m} value={m}>
                {MATERIAL_LABELS[m]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TextField
        label="Đường dẫn hình ảnh (URL)"
        name="imageUrl"
        defaultValue={initial?.imageUrl}
        required
        placeholder="https://..."
      />

      <div>
        <label className="block text-sm mb-1.5">Mô tả</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description}
          className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <TextField
          label="Số lượng đặt tối thiểu"
          name="minQuantity"
          type="number"
          min={1}
          defaultValue={String(initial?.minQuantity ?? 10)}
          required
        />
        <div className="flex flex-col gap-2 justify-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isCustomizable"
              defaultChecked={initial?.isCustomizable ?? true}
            />
            Nhận khắc logo / thiết kế riêng
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={initial?.isActive ?? true}
            />
            Hiển thị công khai trên catalog
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-ink px-6 py-2.5 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
      </button>
    </form>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  min,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  min?: number;
  placeholder?: string;
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
        min={min}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full border border-line bg-white px-3 py-2 text-sm focus-ring"
      />
    </div>
  );
}
