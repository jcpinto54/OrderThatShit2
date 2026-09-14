import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ots.orders.v1";

type Persisted = { count: number; lastItem: string | null };

type OrderState = Persisted & {
  isOpen: boolean;
  prefill: string;
  open: (prefill?: string) => void;
  close: () => void;
  recordOrder: (item: string) => void;
};

const Ctx = createContext<OrderState | null>(null);

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Persisted>;
      return {
        count: typeof parsed.count === "number" ? parsed.count : 0,
        lastItem: typeof parsed.lastItem === "string" ? parsed.lastItem : null,
      };
    }
  } catch {
    /* localStorage is a privilege, not a right */
  }
  return { count: 0, lastItem: null };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(load);
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      /* fine */
    }
  }, [persisted]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const open = useCallback((p = "") => {
    setPrefill(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const recordOrder = useCallback((item: string) => {
    setPersisted((s) => ({ count: s.count + 1, lastItem: item }));
  }, []);

  const value = useMemo<OrderState>(
    () => ({ ...persisted, isOpen, prefill, open, close, recordOrder }),
    [persisted, isOpen, prefill, open, close, recordOrder],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrders(): OrderState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOrders must be used inside <OrderProvider>");
  return v;
}
