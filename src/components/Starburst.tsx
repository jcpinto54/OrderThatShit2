import { useMemo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: number;
  rotate?: number;
  fill?: string;
  text?: string;
  className?: string;
  points?: number;
};

export function Starburst({
  children,
  size = 128,
  rotate = -12,
  fill = "fill-tv",
  text = "text-ink",
  className = "",
  points = 20,
}: Props) {
  const poly = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? 50 : 41;
      const a = (Math.PI * i) / points;
      pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  }, [points]);

  return (
    <div
      className={`inline-grid place-items-center ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full ${fill}`}>
        <polygon points={poly} className="stroke-ink" strokeWidth={2} />
      </svg>
      <div
        className={`relative px-3 text-center font-display uppercase leading-[1] ${text}`}
        style={{ fontSize: size / 9 }}
      >
        {children}
      </div>
    </div>
  );
}
