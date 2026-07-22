-- Migration: add_customers_and_orders
-- Chạy file này trên production database một lần duy nhất.
-- Hoặc dùng: npx prisma db push (sau khi có DATABASE_URL trong .env)

CREATE TYPE "OrderStatus" AS ENUM (
  'DAT_COC', 'DANG_SAN_XUAT', 'KIEM_TRA',
  'SAN_SANG_GIAO', 'DA_GIAO', 'HOAN_TAT', 'HUY'
);

CREATE TABLE "Customer" (
  "id"          TEXT        NOT NULL,
  "code"        TEXT        NOT NULL,
  "name"        TEXT        NOT NULL,
  "type"        TEXT        NOT NULL DEFAULT '',
  "contactName" TEXT        NOT NULL DEFAULT '',
  "phone"       TEXT        NOT NULL DEFAULT '',
  "email"       TEXT        NOT NULL DEFAULT '',
  "address"     TEXT        NOT NULL DEFAULT '',
  "taxCode"     TEXT        NOT NULL DEFAULT '',
  "notes"       TEXT        NOT NULL DEFAULT '',
  "isActive"    BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Customer_code_key" ON "Customer"("code");

CREATE TABLE "Order" (
  "id"               TEXT           NOT NULL,
  "code"             TEXT           NOT NULL,
  "customerId"       TEXT           NOT NULL,
  "quoteRequestId"   TEXT,
  "status"           "OrderStatus"  NOT NULL DEFAULT 'DAT_COC',
  "depositAmount"    DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalAmount"      DOUBLE PRECISION NOT NULL DEFAULT 0,
  "expectedDelivery" TIMESTAMP(3),
  "deliveredAt"      TIMESTAMP(3),
  "assignedTo"       TEXT           NOT NULL DEFAULT '',
  "internalNote"     TEXT           NOT NULL DEFAULT '',
  "createdAt"        TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3)   NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");

CREATE TABLE "OrderItem" (
  "id"         TEXT             NOT NULL,
  "orderId"    TEXT             NOT NULL,
  "productId"  TEXT,
  "customName" TEXT             NOT NULL DEFAULT '',
  "quantity"   INTEGER          NOT NULL DEFAULT 1,
  "unitPrice"  DOUBLE PRECISION NOT NULL DEFAULT 0,
  "note"       TEXT             NOT NULL DEFAULT '',
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_quoteRequestId_fkey"
  FOREIGN KEY ("quoteRequestId") REFERENCES "QuoteRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
