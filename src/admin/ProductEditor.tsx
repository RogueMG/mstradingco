import { ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import type { AdminBrand, AdminImage, AdminProduct } from "../../shared/admin";
import { slugify } from "../../shared/slug";
import { ApiError, adminApi } from "./api";
import { Checkbox, Field, Section } from "./fields";
import ImageList from "./ImageList";
import { SpecsEditor, StringList, TagsInput } from "./ListEditors";
import RichText from "./RichText";
import { buttonClass, inputClass } from "./styles";
import { errorMessage, useToast } from "./toast";
import { categoryPath, flattenCategories, type CategoryIndex } from "./tree";

interface ProductEditorProps {
  productId: number | null;
  categoryId: number | null;
  index: CategoryIndex;
  onSaved: (product: AdminProduct) => void;
  onDeleted: () => void;
}

interface FormState {
  categoryId: number | null;
  title: string;
  slug: string;
  summary: string;
  description: string;
  brandId: number | null;
  keyFeatures: string[];
  specifications: { label: string; value: string }[];
  variants: string[];
  isSample: boolean;
  published: boolean;
  images: AdminImage[];
}

function blank(categoryId: number | null): FormState {
  return {
    categoryId,
    title: "",
    slug: "",
    summary: "",
    description: "",
    brandId: null,
    keyFeatures: [],
    specifications: [],
    variants: [],
    isSample: false,
    published: true,
    images: [],
  };
}

function ProductEditor(props: ProductEditorProps) {
  const { productId } = props;
  const toast = useToast();
  const [loaded, setLoaded] = useState<AdminProduct | null | "loading">(productId ? "loading" : null);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    adminApi
      .product(productId)
      .then((product) => !cancelled && setLoaded(product))
      .catch((err) => {
        if (!cancelled) {
          toast.error(errorMessage(err));
          setLoaded(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [productId, toast]);

  if (loaded === "loading") {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading product…
      </p>
    );
  }

  return <ProductForm key={loaded?.id ?? "new"} {...props} product={loaded} />;
}

function ProductForm({ product, categoryId, index, onSaved, onDeleted }: ProductEditorProps & { product: AdminProduct | null }) {
  const toast = useToast();
  const isNew = !product;
  const [form, setForm] = useState<FormState>(() =>
    product
      ? {
          categoryId: product.categoryId,
          title: product.title,
          slug: product.slug,
          summary: product.summary,
          description: product.description,
          brandId: product.brandId,
          keyFeatures: product.keyFeatures,
          specifications: product.specifications,
          variants: product.variants,
          isSample: product.isSample,
          published: product.published,
          images: product.images,
        }
      : blank(categoryId),
  );
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .brands()
      .then((result) => setBrands(result.brands))
      .catch(() => setBrands([]));
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.categoryId === null) {
      setErrors({ categoryId: "Choose a category." });
      return;
    }

    setSaving(true);
    setErrors({});

    const input = {
      ...form,
      categoryId: form.categoryId,
      keyFeatures: form.keyFeatures.map((item) => item.trim()).filter(Boolean),
      specifications: form.specifications.filter((row) => row.label.trim() || row.value.trim()),
    };

    try {
      const saved = product ? await adminApi.updateProduct(product.id, input) : await adminApi.createProduct(input);
      toast.success(isNew ? "Product created." : "Product saved.");
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fields);
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product) return;
    if (!window.confirm(`Delete "${product.title}"? Its uploaded images are removed too. This can't be undone.`)) return;

    try {
      await adminApi.deleteProduct(product.id);
      toast.success("Product deleted.");
      onDeleted();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const sitePath = product ? `/products/${categoryPath(index, product.categoryId)}/${product.slug}` : null;

  return (
    <form onSubmit={save} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f4511e]">{isNew ? "New product" : "Product"}</p>
          <h1 className="text-2xl font-bold text-[#063b73]">{isNew ? "Add a product" : product.title}</h1>
        </div>
        {sitePath && product?.published && (
          <a href={sitePath} target="_blank" rel="noreferrer" className={buttonClass.secondary}>
            <ExternalLink size={15} /> View on site
          </a>
        )}
      </div>

      <Section title="Basics">
        <Field label="Title" required error={errors.title}>
          <input
            value={form.title}
            onChange={(event) => {
              set("title", event.target.value);
              if (!slugTouched) set("slug", slugify(event.target.value));
            }}
            className={inputClass}
          />
        </Field>

        <Field label="Web address (slug)" required error={errors.slug} hint="Lowercase letters, numbers and dashes. Must differ from subcategories in the same category.">
          <input
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true);
              set("slug", event.target.value);
            }}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" required error={errors.categoryId} hint="Change it to move the product.">
            <select value={form.categoryId ?? ""} onChange={(event) => set("categoryId", event.target.value ? Number(event.target.value) : null)} className={inputClass}>
              <option value="">Choose…</option>
              {flattenCategories(index).map(({ category, depth }) => (
                <option key={category.id} value={category.id}>
                  {"  ".repeat(depth)}
                  {depth > 0 ? "└ " : ""}
                  {category.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Brand" error={errors.brandId}>
            <select value={form.brandId ?? ""} onChange={(event) => set("brandId", event.target.value ? Number(event.target.value) : null)} className={inputClass}>
              <option value="">No brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Summary" error={errors.summary} hint="One or two sentences shown on product cards.">
          <textarea value={form.summary} onChange={(event) => set("summary", event.target.value)} rows={3} className={inputClass} />
        </Field>

        <ImageList images={form.images} onChange={(images) => set("images", images)} defaultAlt={form.title} error={errors.images} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox label="Published" hint="Unpublished products are hidden from the site." checked={form.published} onChange={(value) => set("published", value)} />
          <Checkbox label="Sample listing" hint='Shows a "details to be confirmed" note.' checked={form.isSample} onChange={(value) => set("isSample", value)} />
        </div>
      </Section>

      <Section title="Details">
        <div>
          <p className="text-sm font-semibold text-slate-700">Description</p>
          <RichText value={form.description} onChange={(html) => set("description", html)} />
          {errors.description && <p className="mt-1 text-xs font-medium text-red-600">{errors.description}</p>}
        </div>

        <StringList label="Key features" items={form.keyFeatures} onChange={(items) => set("keyFeatures", items)} placeholder="Add feature" />
        {errors.keyFeatures && <p className="text-xs font-medium text-red-600">{errors.keyFeatures}</p>}

        <SpecsEditor rows={form.specifications} onChange={(rows) => set("specifications", rows)} />
        {errors.specifications && <p className="text-xs font-medium text-red-600">{errors.specifications}</p>}

        <TagsInput label="Variants (sizes, colours…)" tags={form.variants} onChange={(tags) => set("variants", tags)} />
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="submit" className={buttonClass.primary} disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </button>
        {product && (
          <button type="button" className={buttonClass.danger} onClick={remove}>
            <Trash2 size={15} /> Delete product
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductEditor;
