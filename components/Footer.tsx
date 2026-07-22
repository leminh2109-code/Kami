export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-ink/70">
        <p>© {new Date().getFullYear()} Kim Ấn. Thương mại &amp; đặt gia công vàng, bạc, đá quý.</p>
        <p>Chuyên phục vụ cơ quan, tổ chức, doanh nghiệp.</p>
      </div>
    </footer>
  );
}
