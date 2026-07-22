import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/kami-logo.jpg"
            alt="KAMI Jewelry & Art"
            width={120}
            height={60}
            className="h-14 w-auto object-contain mix-blend-multiply"
            priority
          />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm">
          <Link href="/catalog" className="hover:text-brass-dark transition-colors focus-ring">
            Danh mục sản phẩm
          </Link>
          <Link href="/#ve-chung-toi" className="hover:text-brass-dark transition-colors focus-ring">
            Về chúng tôi
          </Link>
          <Link
            href="/quote"
            className="rounded-none border border-ink px-4 py-2 hover:bg-ink hover:text-parchment transition-colors focus-ring"
          >
            Yêu cầu báo giá
          </Link>
        </nav>
        <Link
          href="/quote"
          className="sm:hidden text-sm border border-ink px-3 py-1.5 focus-ring"
        >
          Báo giá
        </Link>
      </div>
    </header>
  );
}
