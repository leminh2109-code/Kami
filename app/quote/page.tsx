import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import QuoteForm from "./QuoteForm";

export const dynamic = "force-dynamic";

export default async function QuotePage({
  searchParams,
}: {
  searchParams: { product?: string };
}) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, code: true },
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="font-display text-3xl mb-2">Yêu cầu báo giá</h1>
        <p className="text-sm text-ink/60 mb-10">
          Vui lòng cho chúng tôi biết thông tin đơn vị và nhu cầu của bạn.
          Chúng tôi sẽ liên hệ lại trong vòng 1–2 ngày làm việc.
        </p>
        <QuoteForm products={products} preselectedProductId={searchParams.product} />
      </main>
      <Footer />
    </>
  );
}
