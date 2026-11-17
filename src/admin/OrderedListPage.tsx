import { ArrowDown, ArrowUp, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { buttonClass } from "./styles";
import { errorMessage, useToast } from "./toast";
import { moveInList } from "./tree";

interface OrderedListPageProps<T extends { id: number }> {
  title: string;
  noun: string;
  load: () => Promise<T[]>;
  reorder: (ids: number[]) => Promise<void>;
  label: (item: T) => ReactNode;
  thumb?: (item: T) => string | null;
  renderEditor: (props: { item: T | null; onSaved: (id?: number) => void; onDeleted: () => void }) => ReactNode;
}

/** A sortable list on the left and the selected item's editor on the right (brands, industries). */
function OrderedListPage<T extends { id: number }>({ title, noun, load, reorder, label, thumb, renderEditor }: OrderedListPageProps<T>) {
  const toast = useToast();
  const [items, setItems] = useState<T[] | null>(null);
  const [selected, setSelected] = useState<number | "new" | null>(null);

  const reload = useCallback(async () => {
    try {
      setItems(await load());
    } catch (err) {
      toast.error(errorMessage(err));
      setItems([]);
    }
  }, [load, toast]);

  // Initial load (event handlers use reload()).
  useEffect(() => {
    let cancelled = false;
    load()
      .then((result) => !cancelled && setItems(result))
      .catch((err) => {
        if (cancelled) return;
        toast.error(errorMessage(err));
        setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [load, toast]);

  const move = async (id: number, delta: -1 | 1) => {
    if (!items) return;
    const ids = moveInList(items.map((item) => item.id), id, delta);
    if (!ids) return;
    try {
      await reorder(ids);
      await reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (!items) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </p>
    );
  }

  const current = typeof selected === "number" ? (items.find((item) => item.id === selected) ?? null) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#063b73]">{title}</h1>
          <button type="button" className={buttonClass.secondary} onClick={() => setSelected("new")}>
            <Plus size={15} /> Add {noun}
          </button>
        </div>

        <ul className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          {items.map((item, position) => (
            <li key={item.id} className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 ${selected === item.id ? "bg-[#063b73]/10" : "hover:bg-slate-50"}`}>
              {thumb &&
                (thumb(item) ? (
                  <img src={thumb(item)!} alt="" className="h-8 w-8 shrink-0 rounded bg-slate-50 object-contain" />
                ) : (
                  <span className="h-8 w-8 shrink-0 rounded bg-slate-100" />
                ))}
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5fa5]"
                onClick={() => setSelected(item.id)}
              >
                {label(item)}
              </button>
              <button type="button" className={buttonClass.icon} aria-label="Move up" disabled={position === 0} onClick={() => void move(item.id, -1)}>
                <ArrowUp size={14} />
              </button>
              <button type="button" className={buttonClass.icon} aria-label="Move down" disabled={position === items.length - 1} onClick={() => void move(item.id, 1)}>
                <ArrowDown size={14} />
              </button>
            </li>
          ))}
          {items.length === 0 && <li className="p-3 text-sm text-slate-500">Nothing here yet.</li>}
        </ul>
      </aside>

      <div className="min-w-0">
        {selected === null ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
            Choose an item on the left, or add a new {noun}. Arrows change the order on the site.
          </div>
        ) : (
          <div key={String(selected)}>
            {renderEditor({
              item: current,
              onSaved: (id) => {
                if (id) setSelected(id);
                void reload();
              },
              onDeleted: () => {
                setSelected(null);
                void reload();
              },
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderedListPage;
