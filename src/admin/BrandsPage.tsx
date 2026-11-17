import { Save, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

import { adminImageSrc, type AdminBrand } from "../../shared/admin";
import { slugify } from "../../shared/slug";
import { ApiError, adminApi } from "./api";
import { Checkbox, Field, Section } from "./fields";
import ImageInput from "./ImageInput";
import OrderedListPage from "./OrderedListPage";
import { buttonClass, inputClass } from "./styles";
import { errorMessage, useToast } from "./toast";

function BrandEditor({ brand, onSaved, onDeleted }: { brand: AdminBrand | null; onSaved: (id?: number) => void; onDeleted: () => void }) {
  const toast = useToast();
  const [form, setForm] = useState({
    name: brand?.name ?? "",
    slug: brand?.slug ?? "",
    tagline: brand?.tagline ?? "",
    description: brand?.description ?? "",
    confirmed: brand?.confirmed ?? true,
    inHouse: brand?.inHouse ?? false,
    logo: brand?.logo ?? null,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(brand));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = brand ? await adminApi.updateBrand(brand.id, form) : await adminApi.createBrand(form);
      toast.success(brand ? "Brand saved." : "Brand added.");
      onSaved(saved.id);
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fields);
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!brand || !window.confirm(`Delete the brand "${brand.name}"? Products keep existing but lose this brand.`)) return;
    try {
      await adminApi.deleteBrand(brand.id);
      toast.success("Brand deleted.");
      onDeleted();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <h1 className="text-2xl font-bold text-[#063b73]">{brand ? brand.name : "Add a brand"}</h1>
      <Section title="Brand">
        <Field label="Name" required error={errors.name}>
          <input
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              setForm((current) => ({ ...current, name, slug: slugTouched ? current.slug : slugify(name) }));
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
        <Field label="Tagline" error={errors.tagline} hint='What the brand covers, e.g. "Power Tools".'>
          <input value={form.tagline} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} className={inputClass} />
        </Field>
        <Field label="Description" error={errors.description} hint="One line shown on the Brands page.">
          <textarea value={form.description} rows={2} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={inputClass} />
        </Field>
        <ImageInput label="Logo (optional)" value={form.logo} onChange={(logo) => setForm((current) => ({ ...current, logo }))} error={errors.logo} defaultAlt={`${form.name} logo`} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox label="Confirmed" hint='Off shows the brand as "confirmation pending".' checked={form.confirmed} onChange={(confirmed) => setForm((current) => ({ ...current, confirmed }))} />
          <Checkbox label="In-house range" hint="The company's own range." checked={form.inHouse} onChange={(inHouse) => setForm((current) => ({ ...current, inHouse }))} />
        </div>
      </Section>
      <div className="flex justify-between gap-3">
        <button type="submit" className={buttonClass.primary} disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : "Save"}
        </button>
        {brand && (
          <button type="button" className={buttonClass.danger} onClick={remove}>
            <Trash2 size={15} /> Delete
          </button>
        )}
      </div>
    </form>
  );
}

function BrandsPage() {
  const load = useCallback(async () => (await adminApi.brands()).brands, []);
  const reorder = useCallback((ids: number[]) => adminApi.reorderBrands(ids), []);

  return (
    <OrderedListPage<AdminBrand>
      title="Brands"
      noun="brand"
      load={load}
      reorder={reorder}
      label={(brand) => (
        <>
          {brand.name}
          {!brand.confirmed && <span className="ml-1.5 text-xs font-normal text-slate-400">pending</span>}
        </>
      )}
      thumb={(brand) => adminImageSrc(brand.logo, true)}
      renderEditor={({ item, onSaved, onDeleted }) => <BrandEditor brand={item} onSaved={onSaved} onDeleted={onDeleted} />}
    />
  );
}

export default BrandsPage;
