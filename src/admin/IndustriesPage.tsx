import { Save, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import { adminImageSrc, type AdminIndustry } from "../../shared/admin";
import { slugify } from "../../shared/slug";
import { ApiError, adminApi } from "./api";
import { Checkbox, Field, Section } from "./fields";
import ImageInput from "./ImageInput";
import OrderedListPage from "./OrderedListPage";
import { buttonClass, inputClass } from "./styles";
import { errorMessage, useToast } from "./toast";

function IndustryEditor({ industry, onSaved, onDeleted }: { industry: AdminIndustry | null; onSaved: (id?: number) => void; onDeleted: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState({
    title: industry?.title ?? "",
    slug: industry?.slug ?? "",
    label: industry?.label ?? "",
    summary: industry?.summary ?? "",
    showOnHome: industry?.showOnHome ?? true,
    image: industry?.image ?? null,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(industry));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = industry ? await adminApi.updateIndustry(industry.id, form) : await adminApi.createIndustry(form);
      toast.success(industry ? "Industry saved." : "Industry added.");
      onSaved(saved.id);
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fields);
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!industry || !window.confirm(`Delete the industry "${industry.title}"?`)) return;
    try {
      await adminApi.deleteIndustry(industry.id);
      toast.success("Industry deleted.");
      onDeleted();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <h1 className="text-2xl font-bold text-[#063b73]">{industry ? industry.title : "Add an industry"}</h1>
      <Section title="Industry">
        <Field label="Title" required error={errors.title}>
          <input
            value={form.title}
            onChange={(event) => {
              const title = event.target.value;
              setForm((current) => ({ ...current, title, slug: slugTouched ? current.slug : slugify(title) }));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Slug" required error={errors.slug}>
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              setForm((current) => ({ ...current, slug: event.target.value }));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Short label" error={errors.label} hint='Shown on tabs, e.g. "Energy".'>
          <input value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} className={inputClass} />
        </Field>
        <Field label="Summary" error={errors.summary}>
          <textarea value={form.summary} rows={3} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} className={inputClass} />
        </Field>
        <ImageInput label="Image" required value={form.image} onChange={(image) => setForm((current) => ({ ...current, image }))} error={errors.image} defaultAlt={form.title} />
        <Checkbox label="Show on the home page" checked={form.showOnHome} onChange={(showOnHome) => setForm((current) => ({ ...current, showOnHome }))} />
      </Section>
      <div className="flex justify-between gap-3">
        <button type="submit" className={buttonClass.primary} disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : "Save"}
        </button>
        {industry && (
          <button type="button" className={buttonClass.danger} onClick={remove}>
            <Trash2 size={15} /> Delete
          </button>
        )}
      </div>
    </form>
  );
}

function IndustriesPage() {
  const load = useCallback(async () => (await adminApi.industries()).industries, []);
  const reorder = useCallback((ids: number[]) => adminApi.reorderIndustries(ids), []);

  return (
    <OrderedListPage<AdminIndustry>
      title="Industries"
      noun="industry"
      load={load}
      reorder={reorder}
      label={(industry) => industry.title}
      thumb={(industry) => adminImageSrc(industry.image, true)}
      renderEditor={({ item, onSaved, onDeleted }) => <IndustryEditor industry={item} onSaved={onSaved} onDeleted={onDeleted} />}
    />
  );
}

export default IndustriesPage;
