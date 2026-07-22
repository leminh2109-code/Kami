# Kim Ấn — Website & trang quản trị mỹ nghệ vàng bạc (B2B)

App Next.js gồm:
- **Trang công khai**: giới thiệu công ty, danh mục sản phẩm theo loại, trang chi tiết sản phẩm, form yêu cầu báo giá.
- **Trang quản trị** (`/admin`): đăng nhập bảo vệ, quản lý sản phẩm (thêm/sửa/xoá), xem & xử lý yêu cầu báo giá.

> Tên "Kim Ấn", màu sắc, và toàn bộ nội dung mẫu là placeholder — bạn có thể đổi tên công ty thật trong `app/layout.tsx` và `components/Header.tsx`, và thay logo/ảnh sản phẩm thật qua trang quản trị.

## 1. Cài đặt local

```bash
npm install
cp .env.example .env
```

Mở `.env` và:
- Để nguyên `DATABASE_URL="file:./dev.db"` (SQLite, không cần cài gì thêm) để chạy thử local.
- Đặt `ADMIN_USERNAME` là tên đăng nhập bạn muốn.
- Tạo `ADMIN_PASSWORD_HASH` bằng lệnh:
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('MAT_KHAU_CUA_BAN', 10))"
  ```
  rồi dán chuỗi hash in ra vào `.env`.
- Đặt `SESSION_SECRET` là một chuỗi ngẫu nhiên dài (ví dụ chạy `openssl rand -hex 32`).

Khởi tạo database và dữ liệu mẫu:

```bash
npx prisma db push
npm run db:seed
```

Chạy thử:

```bash
npm run dev
```

- Trang công khai: http://localhost:3000
- Trang quản trị: http://localhost:3000/admin/login

## 2. Thay dữ liệu mẫu bằng dữ liệu thật

4 sản phẩm mẫu trong `prisma/seed.ts` chỉ để demo (ảnh lấy từ Unsplash). Cách thay bằng sản phẩm thật của công ty bạn:

1. Đăng nhập `/admin/login`.
2. Vào **Sản phẩm** → **+ Thêm sản phẩm**: nhập mã, tên, danh mục, chất liệu, mô tả, và **URL ảnh** (tải ảnh sản phẩm lên một nơi lưu trữ ảnh — xem gợi ý bên dưới — rồi dán link vào đây).
3. Xoá các sản phẩm mẫu nếu không cần.

**Gợi ý lưu trữ ảnh sản phẩm thật**: vì đây là app chạy trên Vercel (không có ổ đĩa lưu file lâu dài), bạn nên upload ảnh lên một dịch vụ lưu trữ rồi dùng URL, ví dụ:
- Vercel Blob Storage
- Cloudinary (miễn phí ở mức cơ bản)
- Hoặc đơn giản là Google Drive/Imgur nếu chỉ cần demo nhanh (không khuyến khích cho lâu dài)

## 3. Đưa lên Vercel (production)

Vì Vercel chạy serverless, **SQLite không dùng được ở production** — bạn cần một database Postgres thật:

1. Đẩy code lên GitHub.
2. Vào [vercel.com](https://vercel.com) → New Project → Import repo này.
3. Trong project trên Vercel: **Storage** → **Create Database** → chọn **Postgres** (Neon, tích hợp sẵn).
4. Vercel sẽ tự thêm biến môi trường `DATABASE_URL` cho bạn.
5. Trong `prisma/schema.prisma`, đổi:
   ```prisma
   datasource db {
     provider = "sqlite"   // đổi thành:
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. Thêm các biến môi trường còn lại trong Vercel (**Settings → Environment Variables**):
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `SESSION_SECRET`
7. Deploy. Sau lần deploy đầu tiên, chạy migrate + seed nhắm vào database production (chạy 1 lần từ máy local với `DATABASE_URL` production trong `.env`):
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## 4. Cấu trúc thư mục chính

```
app/
  page.tsx              → Trang chủ
  catalog/              → Danh mục & chi tiết sản phẩm (công khai)
  quote/                → Form yêu cầu báo giá (công khai)
  admin/
    login/              → Đăng nhập quản trị
    (protected)/         → Các trang cần đăng nhập (dashboard, sản phẩm, báo giá)
  api/                  → Các API route (public + admin)
components/             → Các thành phần UI dùng chung
lib/                    → Prisma client, auth, nhãn hiển thị (labels), slugify
prisma/schema.prisma    → Mô hình dữ liệu (Product, QuoteRequest, QuoteItem)
prisma/seed.ts          → Dữ liệu mẫu
```

## 5. Những điều nên làm tiếp

- Đổi tên thương hiệu, logo, màu sắc theo đúng công ty bạn (hiện đang dùng bảng màu vàng đồng/ngà làm placeholder).
- Cân nhắc thêm xác thực 2 lớp hoặc nhiều tài khoản admin nếu có nhiều nhân sự quản trị.
- Thêm thông báo email tự động khi có yêu cầu báo giá mới (ví dụ dùng Resend hoặc SendGrid) — hiện tại yêu cầu chỉ hiển thị trong trang quản trị.
- Nếu khối lượng ảnh sản phẩm lớn, nên tích hợp Vercel Blob hoặc Cloudinary để upload ảnh trực tiếp từ trang quản trị thay vì dán URL thủ công.
