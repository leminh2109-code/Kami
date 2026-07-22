import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between text-sm text-ink/70">
        <div className="flex items-center gap-4">
          <Image
            src="/kami-logo.jpg"
            alt="KAMI Jewelry & Art"
            width={80}
            height={40}
            className="h-10 w-auto object-contain mix-blend-multiply opacity-70"
          />
          <p>© {new Date().getFullYear()} KAMI Jewelry &amp; Art.</p>
        </div>
        <p>Thương mại &amp; đặt gia công vàng, bạc, đá quý. Chuyên phục vụ cơ quan, tổ chức, doanh nghiệp.</p>
      </div>
    </footer>
  );
}
