import { prisma } from "@/lib/db";
import QuoteStatusSelect from "@/components/QuoteStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Yêu cầu báo giá</h1>

      {quotes.length === 0 ? (
        <p className="text-sm text-ink/60">Chưa có yêu cầu nào.</p>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div key={q.id} className="border border-line p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{q.companyName}</p>
                  <p className="text-sm text-ink/60">
                    {q.contactName} · {q.phone} · {q.email}
                  </p>
                  {q.organizationType && (
                    <p className="text-xs text-ink/50 mt-1">{q.organizationType}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink/50">
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(q.createdAt)}
                  </span>
                  <QuoteStatusSelect id={q.id} status={q.status} />
                </div>
              </div>

              {q.items.length > 0 && (
                <div className="mt-3 text-sm">
                  <p className="text-ink/50 mb-1">Sản phẩm quan tâm:</p>
                  <ul className="list-disc list-inside">
                    {q.items.map((it) => (
                      <li key={it.id}>
                        {it.product.name} ({it.product.code}) — SL: {it.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {q.message && (
                <p className="mt-3 text-sm text-ink/70 whitespace-pre-line border-t border-line pt-3">
                  {q.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
