import UniLogo from "@/components/UniLogo";
import { uniLogo } from "@/data/universities";

// Overlapping stack of university logo badges (like a stacked-avatar cluster).
// Shows up to `max` logos; extra institutions collapse into a "+N" chip.
export default function UniLogoStack({
  names,
  size = 30,
  max = 3,
  ring = "#0a0a0a",
}: {
  names: string[];
  size?: number;
  max?: number;
  ring?: string;
}) {
  const list = (names || []).filter((n) => uniLogo(n));
  if (list.length === 0) return null;

  const shown = list.length > max ? list.slice(0, max - 1) : list;
  const extra = list.length - shown.length;
  const overlap = Math.round(size * 0.34);

  return (
    <div className="!flex !items-center">
      {shown.map((name, i) => (
        <div
          key={name}
          className="!relative"
          style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: i + 1 }}
        >
          <UniLogo name={name} size={size} ring={ring} />
        </div>
      ))}
      {extra > 0 ? (
        <div className="!relative" style={{ marginLeft: -overlap, zIndex: shown.length + 1 }}>
          <span
            className="!inline-flex !items-center !justify-center !rounded-full !bg-zinc-700 !text-white !font-bold !shrink-0"
            style={{
              width: size,
              height: size,
              fontSize: Math.round(size * 0.4),
              boxShadow: `0 0 0 2px ${ring}`,
            }}
          >
            +{extra}
          </span>
        </div>
      ) : null}
    </div>
  );
}
