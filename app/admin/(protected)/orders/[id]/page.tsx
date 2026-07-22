import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_ORDER,
  formatVND,
} from "@/lib/labels";
import OrderStatusSelect from "@/components/OrderStatusSelect";

export const dynamic = "force-dynamic";

const PROGRESS_STEPS = [
  "DAT_COC",
  "DANG_SAN_XUAT",
  "KIEM_TRA",
  "SAN_SANG_GIAO",
  "DA_GIAO",
  "HOAN_TAT",
] as const;

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      workshop: { select: { id: true, code: true, name: true, phone: true } },
      quoteRequest: { select: { id: true, companyName: true } },
      items: {
        include: { product: { select: { id: true, code: true, name: true } } },
      },
    },
  });

  if (!order) notFound();

  const statusIndex = PROGRESS_STEPS.indexOf(order.status as typeof PROGRESS_STEPS[number]);
  const isCancelled = order.status === "HUY";
  const remaining = order.totalAmount - order.depositAmount;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-ink/40 font-mono mb-1">{order.code}</p>
          <h1 className="font-display text-2xl">{order.customer.name}</h1>
          <p className="text-sm text-ink/60 mt-1">
            Tạo ngày{" "}
            {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(order.createdAt)}
            {order.assignedTo && ` · Phụ trách: ${order.assignedTo}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 border ${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <OrderStatusSelect id={order.id} status={order.status} />
        </div>
      </div>

      {/* Progress bar */}
      {!isCancelled && (
        <div className="mb-8">
          <div className="flex items-center gap-0">
            {PROGRESS_STEPS.map((step, i) => {
              const done = i <= statusIndex;
              const current = i === statusIndex;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full border-2 ${
                        done
                          ? "bg-ink border-ink"
                          : "bg-white border-line"
                      } ${current ? "ring-2 ring-ink/20 ring-offset-1" : ""}`}
                    />
                    <p className="text-[10px] text-ink/50 mt-1 w-16 text-center leading-tight">
                      {ORDER_STATUS_LABELS[step]}
                    </p>
                  </div>
                  {i < PROGRESS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 -mt-5 ${i < statusIndex ? "bg-ink" : "bg-line"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Thông tin */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <InfoBlock label="Khách hàng">
          <Link href={`/admin/customers/${order.customer.id}/edit`} className="hover:underline font-medium">
            {order.customer.name}
          </Link>
          {order.customer.type && <p className="text-ink/60 text-xs">{order.customer.type}</p>}
          {order.customer.contactName && (
            <p className="text-ink/60 text-sm">{order.customer.contactName} · {order.customer.phone}</p>
          )}
        </InfoBlock>

        <InfoBlock label="Thời gian">
          <p>Hạn giao: {order.expectedDelivery
            ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(order.expectedDelivery)
            : <span className="text-ink/40">Chưa xác định</span>}
          </p>
          {order.deliveredAt && (
            <p className="text-sm text-ink/60">
              Đã giao: {new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(order.deliveredAt)}
            </p>
          )}
        </InfoBlock>

        {order.workshop && (
          <InfoBlock label="Xưởng gia công">
            <p className="font-medium">{order.workshop.name}</p>
            <p className="text-ink/60 text-xs">{order.workshop.code}{order.workshop.phone ? ` · ${order.workshop.phone}` : ""}</p>
          </InfoBlock>
        )}

        {order.quoteRequest && (
          <InfoBlock label="Từ báo giá">
            <p className="text-sm">{order.quoteRequest.companyName}</p>
          </InfoBlock>
        )}
      </div>

      {/* Mặt hàng */}
      <div className="mb-8">
        <h2 className="text-base font-medium mb-3">Mặt hàng</h2>
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink/50 bg-line/20">
                <th className="px-4 py-2 font-normal">Sản phẩm</th>
                <th className="px-4 py-2 font-normal text-right">SL</th>
                <th className="px-4 py-2 font-normal text-right">Đơn giá</th>
                <th className="px-4 py-2 font-normal text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    {item.product ? (
                      <>
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-ink/40 text-xs ml-2">{item.product.code}</span>
                      </>
                    ) : (
                      <span className="font-medium">{item.customName}</span>
                    )}
                    {item.note && <p className="text-xs text-ink/50 mt-0.5">{item.note}</p>}
                  </td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-ink/70">{formatVND(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatVND(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tài chính */}
      <div className="mb-8 border border-line p-5">
        <h2 className="text-base font-medium mb-4">Tài chính</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Tổng giá trị</span>
            <span className="font-medium text-base">{formatVND(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Đã đặt cọc</span>
            <span className="text-emerald-700">{formatVND(order.depositAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2">
            <span className="font-medium">Còn lại</span>
            <span className={`font-display text-base ${remaining > 0 ? "text-amber-700" : "text-emerald-700"}`}>
              {formatVND(remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Ghi chú */}
      {order.internalNote && (
        <div className="mb-8">
          <h2 className="text-base font-medium mb-2">Ghi chú nội bộ</h2>
          <p className="text-sm text-ink/70 whitespace-pre-line border border-dashed border-line p-4">
            {order.internalNote}
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-line">
        <Link href="/admin/orders" className="text-sm text-ink/50 hover:text-ink">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    </div>
  );
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-ink/40 uppercase tracking-wide mb-1">{label}</p>
      <div className="text-sm space-y-0.5">{children}</div>
    </div>
  );
}
