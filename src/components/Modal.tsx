import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  size?: "md" | "lg" | "full";
  tone?: "paper" | "ink";
};

export function Modal({ open, onClose, children, label, size = "md", tone = "paper" }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>(
        "input, button, [tabindex]:not([tabindex='-1'])",
      );
      first?.focus();
    }, 30);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const width =
    size === "full" ? "max-w-5xl" : size === "lg" ? "max-w-3xl" : "max-w-xl";
  const skin =
    tone === "ink"
      ? "bg-ink text-paper border-paper shadow-hard-tv"
      : "bg-paper text-ink border-ink shadow-hard";

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative w-full ${width} animate-pop border-[3px] p-6 sm:p-8 ${skin}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center border-2 border-current font-display text-lg leading-none transition hover:bg-urgent hover:text-white"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
