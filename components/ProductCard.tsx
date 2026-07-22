import Image from "next/image";
import Link from "next/link";
import HallmarkBadge from "./HallmarkBadge";

type Props = {
  index: number;
  code: string;
  name: string;
  slug: string;
  imageUrl: string;
  material: string;
  minQuantity: number;
};

export default function ProductCard({
  index,
  code,
  name,
  slug,
  imageUrl,
  material,
  minQuantity,
}: Props) {
  return (
    <Link
      href={`/catalog/${slug}`}
      className="group block border-t border-line pt-4 focus-ring"
    >
      <div className="flex items-baseline justify-between text-xs text-ink/50 mb-2">
        <span>{String(index).padStart(2, "0")}</span>
        <span>{code}</span>
      </div>
      <div className="relative aspect-square bg-white overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 space-y-1.5">
        <h3 className="font-display text-lg leading-snug">{name}</h3>
        <HallmarkBadge material={material} />
        <p className="text-xs text-ink/60">Đặt tối thiểu {minQuantity} sản phẩm</p>
      </div>
    </Link>
  );
}
