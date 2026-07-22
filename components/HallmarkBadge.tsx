import { MATERIAL_LABELS } from "@/lib/labels";

// A small stamp-like badge, evoking the hallmark stamps used to mark
// gold/silver purity (999, 925, 750...) — grounds the UI in the
// industry's own vernacular instead of a generic tag/chip.
export default function HallmarkBadge({ material }: { material: string }) {
  const label = MATERIAL_LABELS[material] ?? material;
  return (
    <span className="inline-flex items-center gap-1.5 border border-brass/60 px-2 py-1 text-[11px] uppercase tracking-wider text-brass-dark">
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      {label}
    </span>
  );
}
