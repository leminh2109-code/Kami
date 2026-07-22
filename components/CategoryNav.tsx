import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/labels";
import clsx from "clsx";

export default function CategoryNav({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-4">
      <Link
        href="/catalog"
        className={clsx(
          "text-sm focus-ring",
          !active ? "text-ink font-medium" : "text-ink/50 hover:text-ink"
        )}
      >
        Tất cả
      </Link>
      {CATEGORY_ORDER.map((cat) => (
        <Link
          key={cat}
          href={`/catalog?category=${cat}`}
          className={clsx(
            "text-sm focus-ring",
            active === cat ? "text-ink font-medium" : "text-ink/50 hover:text-ink"
          )}
        >
          {CATEGORY_LABELS[cat]}
        </Link>
      ))}
    </div>
  );
}
