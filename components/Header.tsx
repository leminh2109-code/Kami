import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brass text-brass text-sm font-display">
            KA
          </span>
          <span className="font-display text-xl tracking-tight">
            Kim Ấn
          </span>
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
