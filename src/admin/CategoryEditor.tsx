import { ExternalLink, Save, Trash2 } from "lucide-react";
import { useState } from "react";

import type { AdminCategory, AdminImage } from "../../shared/admin";
import { slugify } from "../../shared/slug";
import { ApiError, adminApi } from "./api";
import { DraftUploadsProvider, useDraftUploads } from "./draftUploads";
import { Checkbox, Field, Section } from "./fields";
import ImageInput from "./ImageInput";
import { buttonClass, inputClass } from "./styles";
import { errorMessage, useToast } from "./toast";
import { categoryPath, flattenCategories, selfAndDescendants, type CategoryIndex } from "./tree";

interface CategoryEditorProps {
  category: AdminCategory | null;
  parentId: number | null;
  index: CategoryIndex;
  onSaved: (category: AdminCategory) => void;
  onDeleted: () => void;
}

/** Create or edit a category: rename, move (no cycles), image, home-page flag, delete when empty. */
function CategoryEditor({ category, parentId, index, onSaved, onDeleted }: CategoryEditorProps) {
  const toast = useToast();
  const isNew = !category;
  const [title, setTitle] = useState(category?.title ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [eyebrow, setEyebrow] = useState(category?.eyebrow ?? "");
  const [summary, setSummary] = useState(category?.summary ?? "");
  const [image, setImage] = useState<AdminImage | null>(category?.image ?? null);
  const [showOnHome, setShowOnHome] = useState(category?.showOnHome ?? true);
  const [parent, setParent] = useState<number | null>(category ? category.parentId : parentId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const drafts = useDraftUploads();

  const blocked = category ? selfAndDescendants(index, category.id) : new Set<number>();
  const parentOptions = flattenCategories(index).filter(({ category: option }) => !blocked.has(option.id));
  const childCount = category ? (index.children.get(category.id)?.length ?? 0) : 0;
  const productCount = category ? (index.products.get(category.id)?.length ?? 0) : 0;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const input = { parentId: parent, title, slug, eyebrow, summary, image, showOnHome };

    drafts.setSaving(true);
    try {
      const saved = category ? await adminApi.updateCategory(category.id, input) : await adminApi.createCategory(input);
      drafts.saved([saved.image]);
      toast.success(isNew ? "Category created." : "Category saved.");
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fields);
      toast.error(errorMessage(err));
    } finally {
      drafts.setSaving(false);
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!category) return;
    if (!window.confirm(`Delete the category "${category.title}"? This can't be undone.`)) return;

    try {
      await adminApi.deleteCategory(category.id);
      toast.success("Category deleted.");
      onDeleted();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4511e]">{isNew ? "New category" : "Category"}</p>
          <h1 className="text-2xl font-bold text-[#063b73]">{isNew ? "Add a category" : category.title}</h1>
        </div>
        {category && (
          <a href={`/products/${categoryPath(index, category.id)}`} target="_blank" rel="noreferrer" className={buttonClass.secondary}>
            <ExternalLink size={15} /> View on site
          </a>
        )}
      </div>

      <Section title="Details">
        <Field label="Title" required error={errors.title}>
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            className={inputClass}
          />
        </Field>

        <Field label="Web address (slug)" required error={errors.slug} hint="Lowercase letters, numbers and dashes. Changing it changes the page's address.">
          <input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            className={inputClass}
          />
        </Field>

        <Field label="Parent category" error={errors.parentId} hint="Move this category by choosing a different parent.">
          <select value={parent ?? ""} onChange={(event) => setParent(event.target.value ? Number(event.target.value) : null)} className={inputClass}>
            <option value="">— Top level —</option>
            {parentOptions.map(({ category: option, depth }) => (
              <option key={option.id} value={option.id}>
                {"  ".repeat(depth)}
                {depth > 0 ? "└ " : ""}
                {option.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Short label" error={errors.eyebrow} hint='Small label shown above the title, e.g. "Safety Footwear".'>
          <input value={eyebrow} onChange={(event) => setEyebrow(event.target.value)} className={inputClass} />
        </Field>

        <Field label="Summary" error={errors.summary} hint="One or two sentences shown on cards and the category page.">
          <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={3} className={inputClass} />
        </Field>

        <DraftUploadsProvider value={drafts}>
          <ImageInput label="Image" required value={image} onChange={setImage} error={errors.image} defaultAlt={`${title} products`} />
        </DraftUploadsProvider>

        <Checkbox label="Show on the home page" hint="Top-level categories with this on appear in the home page grid." checked={showOnHome} onChange={setShowOnHome} />
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="submit" className={buttonClass.primary} disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : isNew ? "Create category" : "Save changes"}
        </button>

        {category && (
          <button
            type="button"
            className={buttonClass.danger}
            onClick={remove}
            disabled={childCount > 0 || productCount > 0}
            title={childCount || productCount ? "Only empty categories can be deleted" : undefined}
          >
            <Trash2 size={15} /> Delete
          </button>
        )}
      </div>

      {category && (childCount > 0 || productCount > 0) && (
        <p className="text-xs text-slate-500">
          To delete this category, first move or delete its {childCount} subcategor{childCount === 1 ? "y" : "ies"} and{" "}
          {productCount} product{productCount === 1 ? "" : "s"}.
        </p>
      )}
    </form>
  );
}

export default CategoryEditor;
