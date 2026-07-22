import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HallmarkBadge from "@/components/HallmarkBadge";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product || !product.isActive) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-12 grid sm:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-white">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-ink/50 mb-2">
            {CATEGORY_LABELS[product.category]} · {product.code}
          </p>
          <h1 className="font-display text-3xl mb-4">{product.name}</h1>
          <HallmarkBadge material={product.material} />
          <p className="mt-6 text-sm text-ink/70 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
          <dl className="mt-8 space-y-2 text-sm">
            <div className="flex justify-between border-t border-line py-2">
              <dt className="text-ink/60">Số lượng đặt tối thiểu</dt>
              <dd>{product.minQuantity} sản phẩm</dd>
            </div>
            <div className="flex justify-between border-t border-line py-2">
              <dt className="text-ink/60">Khắc logo / thiết kế riêng</dt>
              <dd>{product.isCustomizable ? "Nhận đặt riêng" : "Mẫu cố định"}</dd>
            </div>
          </dl>
          <Link
            href={`/quote?product=${product.id}`}
            className="mt-10 inline-block border border-ink px-6 py-3 text-sm hover:bg-ink hover:text-parchment transition-colors focus-ring"
          >
            Yêu cầu báo giá cho sản phẩm này
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
