import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category as any } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl mb-2">Danh mục sản phẩm</h1>
        <p className="text-sm text-ink/60 mb-8">
          {category ? CATEGORY_LABELS[category] : "Toàn bộ mẫu mã hiện có"} — vui
          lòng gửi yêu cầu báo giá để nhận đơn giá theo số lượng.
        </p>
        <CategoryNav active={category} />

        {products.length === 0 ? (
          <p className="mt-12 text-sm text-ink/60">
            Chưa có sản phẩm nào trong danh mục này. Vui lòng thêm sản phẩm
            trong trang quản trị.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                index={i + 1}
                code={p.code}
                name={p.name}
                slug={p.slug}
                imageUrl={p.imageUrl}
                material={p.material}
                minQuantity={p.minQuantity}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
