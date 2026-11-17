import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import { buttonClass, inputClass } from "./styles";

/** A list of single-line strings (e.g. key features). */
export function StringList({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <ul className="mt-1.5 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <input
              aria-label={`${label} ${index + 1}`}
              value={item}
              onChange={(event) => onChange(items.map((value, i) => (i === index ? event.target.value : value)))}
              className={inputClass.replace("mt-1.5 ", "")}
            />
            <button type="button" className={buttonClass.icon} aria-label="Remove" onClick={() => onChange(items.filter((_, i) => i !== index))}>
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={`${buttonClass.secondary} mt-2`} onClick={() => onChange([...items, ""])}>
        <Plus size={15} /> {placeholder}
      </button>
    </div>
  );
}

/** Label/value rows for the specifications table. */
export function SpecsEditor({
  rows,
  onChange,
}: {
  rows: { label: string; value: string }[];
  onChange: (rows: { label: string; value: string }[]) => void;
}) {
  const update = (index: number, key: "label" | "value", value: string) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">Specifications</p>
      <ul className="mt-1.5 space-y-2">
        {rows.map((row, index) => (
          <li key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <input aria-label={`Specification ${index + 1} label`} placeholder="Label, e.g. Material" value={row.label} onChange={(event) => update(index, "label", event.target.value)} className={inputClass.replace("mt-1.5 ", "")} />
            <input aria-label={`Specification ${index + 1} value`} placeholder="Value, e.g. Nitrile" value={row.value} onChange={(event) => update(index, "value", event.target.value)} className={inputClass.replace("mt-1.5 ", "")} />
            <button type="button" className={buttonClass.icon} aria-label="Remove" onClick={() => onChange(rows.filter((_, i) => i !== index))}>
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={`${buttonClass.secondary} mt-2`} onClick={() => onChange([...rows, { label: "", value: "" }])}>
        <Plus size={15} /> Add specification
      </button>
    </div>
  );
}

/** Tag-style input (e.g. variants: sizes, colours). Enter or comma adds a tag. */
export function TagsInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const parts = draft
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part && !tags.includes(part));
    if (parts.length) onChange([...tags, ...parts]);
    setDraft("");
  };

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-2 rounded-lg border border-slate-300 bg-white p-2">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#063b73]/10 px-2.5 py-1 text-xs font-semibold text-[#063b73]">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((item) => item !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          aria-label={label}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder="Type and press Enter"
          className="min-w-32 flex-1 px-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}
