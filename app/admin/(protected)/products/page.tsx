import Link from "next/link";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS, MATERIAL_LABELS } from "@/lib/labels";
import DeleteProductButton from "@/components/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl">Sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-ink/60">Chưa có sản phẩm nào.</p>
      ) : (
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50">
                <th className="px-4 py-3 font-normal">Mã</th>
                <th className="px-4 py-3 font-normal">Tên</th>
                <th className="px-4 py-3 font-normal">Danh mục</th>
                <th className="px-4 py-3 font-normal">Chất liệu</th>
                <th className="px-4 py-3 font-normal">Hiển thị</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink/60">{p.code}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{CATEGORY_LABELS[p.category]}</td>
                  <td className="px-4 py-3">{MATERIAL_LABELS[p.material]}</td>
                  <td className="px-4 py-3">{p.isActive ? "Có" : "Ẩn"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 justify-end">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-sm text-brass-dark hover:underline focus-ring"
                      >
                        Sửa
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
