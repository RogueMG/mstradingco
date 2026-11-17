import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FolderPlus,
  Loader2,
  PackagePlus,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import type { AdminCategory, AdminTree } from "../../shared/admin";
import { adminApi } from "./api";
import CategoryEditor from "./CategoryEditor";
import ProductEditor from "./ProductEditor";
import { buttonClass } from "./styles";
import { errorMessage, useToast } from "./toast";
import { indexTree, moveInList, type CategoryIndex } from "./tree";

/** Catalogue: the category tree on the left, the selected item's editor on the right. */
function CataloguePage() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [tree, setTree] = useState<AdminTree | null>(null);
  const [loadError, setLoadError] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const reload = useCallback(async () => {
    try {
      setTree(await adminApi.tree());
      setLoadError("");
    } catch (err) {
      setLoadError(errorMessage(err));
    }
  }, []);

  // Initial load (event handlers use reload()).
  useEffect(() => {
    let cancelled = false;
    adminApi
      .tree()
      .then((result) => !cancelled && setTree(result))
      .catch((err) => !cancelled && setLoadError(errorMessage(err)));
    return () => {
      cancelled = true;
    };
  }, []);

  const index = useMemo(() => (tree ? indexTree(tree) : null), [tree]);

  const select = (next: Record<string, string>) => setParams(next, { replace: false });
  const selectedCategory = Number(params.get("c")) || null;
  const selectedProduct = Number(params.get("p")) || null;
  const creating = params.get("new");

  const expandPath = (id: number | null) => {
    if (!index || id === null) return;
    setExpanded((current) => {
      const next = new Set(current);
      let node = index.byId.get(id);
      while (node) {
        next.add(node.id);
        node = node.parentId != null ? index.byId.get(node.parentId) : undefined;
      }
      return next;
    });
  };

  const reorderCategory = async (category: AdminCategory, delta: -1 | 1) => {
    if (!index) return;
    const siblings = (index.children.get(category.parentId) ?? []).map((item) => item.id);
    const ids = moveInList(siblings, category.id, delta);
    if (!ids) return;
    try {
      await adminApi.reorderCategories(category.parentId, ids);
      await reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const reorderProduct = async (categoryId: number, productId: number, delta: -1 | 1) => {
    if (!index) return;
    const ids = moveInList((index.products.get(categoryId) ?? []).map((item) => item.id), productId, delta);
    if (!ids) return;
    try {
      await adminApi.reorderProducts(categoryId, ids);
      await reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const togglePublished = async (productId: number, published: boolean) => {
    try {
      await adminApi.setPublished(productId, published);
      toast.success(published ? "Product published." : "Product unpublished (hidden from the site).");
      await reload();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (loadError) {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {loadError}{" "}
        <button type="button" className="font-bold underline" onClick={() => void reload()}>
          Try again
        </button>
      </div>
    );
  }

  if (!tree || !index) {
    return (
      <p className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading catalogue…
      </p>
    );
  }

  let editor: React.ReactNode = (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
      <p className="font-semibold text-[#063b73]">Choose a category or product on the left to edit it.</p>
      <p className="mt-2">
        Use <FolderPlus size={14} className="inline" /> to add a subcategory and <PackagePlus size={14} className="inline" /> to add a
        product inside a category. Arrows change the order on the site.
      </p>
    </div>
  );

  if (creating === "category") {
    const parentId = Number(params.get("parent")) || null;
    editor = (
      <CategoryEditor
        key={`new-${parentId}`}
        category={null}
        parentId={parentId}
        index={index}
        onSaved={async (saved) => {
          await reload();
          expandPath(saved.parentId);
          select({ c: String(saved.id) });
        }}
        onDeleted={() => select({})}
      />
    );
  } else if (creating === "product") {
    const categoryId = Number(params.get("category")) || null;
    editor = (
      <ProductEditor
        key={`new-${categoryId}`}
        productId={null}
        categoryId={categoryId}
        index={index}
        onSaved={async (saved) => {
          await reload();
          expandPath(saved.categoryId);
          select({ p: String(saved.id) });
        }}
        onDeleted={() => select({})}
      />
    );
  } else if (selectedCategory && index.byId.has(selectedCategory)) {
    editor = (
      <CategoryEditor
        key={`c-${selectedCategory}-${index.byId.get(selectedCategory)!.updatedAt}`}
        category={index.byId.get(selectedCategory)!}
        parentId={null}
        index={index}
        onSaved={async (saved) => {
          await reload();
          expandPath(saved.parentId);
        }}
        onDeleted={async () => {
          await reload();
          select({});
        }}
      />
    );
  } else if (selectedProduct) {
    editor = (
      <ProductEditor
        key={`p-${selectedProduct}`}
        productId={selectedProduct}
        categoryId={null}
        index={index}
        onSaved={async (saved) => {
          await reload();
          expandPath(saved.categoryId);
        }}
        onDeleted={async () => {
          await reload();
          select({});
        }}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(300px,380px)_1fr]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-[#063b73]">Catalogue</h1>
          <button type="button" className={buttonClass.secondary} onClick={() => select({ new: "category" })}>
            <Plus size={15} /> Top-level category
          </button>
        </div>

        <nav aria-label="Catalogue tree" className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <TreeLevel
            parentId={null}
            depth={0}
            index={index}
            expanded={expanded}
            onToggle={(id) =>
              setExpanded((current) => {
                const next = new Set(current);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
            selectedCategory={creating ? null : selectedCategory}
            selectedProduct={creating ? null : selectedProduct}
            onSelectCategory={(id) => select({ c: String(id) })}
            onSelectProduct={(id) => select({ p: String(id) })}
            onAddChild={(id) => {
              expandPath(id);
              select({ new: "category", parent: String(id) });
            }}
            onAddProduct={(id) => {
              expandPath(id);
              select({ new: "product", category: String(id) });
            }}
            onReorderCategory={reorderCategory}
            onReorderProduct={reorderProduct}
            onTogglePublished={togglePublished}
          />
          {tree.categories.length === 0 && <p className="p-3 text-sm text-slate-500">No categories yet. Add a top-level category to begin.</p>}
        </nav>
      </aside>

      <div className="min-w-0">{editor}</div>
    </div>
  );
}

interface TreeLevelProps {
  parentId: number | null;
  depth: number;
  index: CategoryIndex;
  expanded: Set<number>;
  onToggle: (id: number) => void;
  selectedCategory: number | null;
  selectedProduct: number | null;
  onSelectCategory: (id: number) => void;
  onSelectProduct: (id: number) => void;
  onAddChild: (id: number) => void;
  onAddProduct: (id: number) => void;
  onReorderCategory: (category: AdminCategory, delta: -1 | 1) => void;
  onReorderProduct: (categoryId: number, productId: number, delta: -1 | 1) => void;
  onTogglePublished: (productId: number, published: boolean) => void;
}

function TreeLevel(props: TreeLevelProps) {
  const { parentId, depth, index, expanded } = props;
  const categories = index.children.get(parentId) ?? [];

  return (
    <ul className={depth > 0 ? "ml-4 border-l border-slate-100 pl-2" : ""}>
      {categories.map((category, position) => {
        const children = index.children.get(category.id) ?? [];
        const products = index.products.get(category.id) ?? [];
        const isOpen = expanded.has(category.id);
        const isSelected = props.selectedCategory === category.id;

        return (
          <li key={category.id}>
            <div className={`group flex items-center gap-1 rounded-lg px-1 py-1 ${isSelected ? "bg-[#063b73]/10" : "hover:bg-slate-50"}`}>
              <button
                type="button"
                className={buttonClass.icon}
                aria-label={isOpen ? `Collapse ${category.title}` : `Expand ${category.title}`}
                aria-expanded={isOpen}
                onClick={() => props.onToggle(category.id)}
                disabled={children.length === 0 && products.length === 0}
              >
                {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              <button
                type="button"
                onClick={() => props.onSelectCategory(category.id)}
                className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5fa5]"
              >
                {category.title}
                <span className="ml-1.5 text-xs font-normal text-slate-400">{products.length}</span>
              </button>

              <span className="flex shrink-0 opacity-60 group-hover:opacity-100">
                <button type="button" className={buttonClass.icon} aria-label={`Move ${category.title} up`} disabled={position === 0} onClick={() => props.onReorderCategory(category, -1)}>
                  <ArrowUp size={14} />
                </button>
                <button type="button" className={buttonClass.icon} aria-label={`Move ${category.title} down`} disabled={position === categories.length - 1} onClick={() => props.onReorderCategory(category, 1)}>
                  <ArrowDown size={14} />
                </button>
                <button type="button" className={buttonClass.icon} aria-label={`Add a subcategory to ${category.title}`} title="Add subcategory" onClick={() => props.onAddChild(category.id)}>
                  <FolderPlus size={14} />
                </button>
                <button type="button" className={buttonClass.icon} aria-label={`Add a product to ${category.title}`} title="Add product" onClick={() => props.onAddProduct(category.id)}>
                  <PackagePlus size={14} />
                </button>
              </span>
            </div>

            {isOpen && (
              <>
                <TreeLevel {...props} parentId={category.id} depth={depth + 1} />
                <ul className="ml-4 border-l border-slate-100 pl-2">
                  {products.map((product, productPosition) => (
                    <li key={product.id}>
                      <div className={`group flex items-center gap-2 rounded-lg px-1 py-1 ${props.selectedProduct === product.id ? "bg-[#f4511e]/10" : "hover:bg-slate-50"}`}>
                        {product.thumb ? (
                          <img src={product.thumb} alt="" className="h-7 w-7 shrink-0 rounded object-cover" />
                        ) : (
                          <span className="h-7 w-7 shrink-0 rounded bg-slate-100" />
                        )}
                        <button
                          type="button"
                          onClick={() => props.onSelectProduct(product.id)}
                          className={`min-w-0 flex-1 truncate text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5fa5] ${product.published ? "text-slate-700" : "text-slate-400 line-through"}`}
                        >
                          {product.title}
                        </button>
                        <span className="flex shrink-0 opacity-60 group-hover:opacity-100">
                          <button
                            type="button"
                            className={buttonClass.icon}
                            aria-label={product.published ? `Unpublish ${product.title}` : `Publish ${product.title}`}
                            title={product.published ? "Published: click to hide" : "Hidden: click to publish"}
                            onClick={() => props.onTogglePublished(product.id, !product.published)}
                          >
                            {product.published ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button type="button" className={buttonClass.icon} aria-label={`Move ${product.title} up`} disabled={productPosition === 0} onClick={() => props.onReorderProduct(category.id, product.id, -1)}>
                            <ArrowUp size={14} />
                          </button>
                          <button type="button" className={buttonClass.icon} aria-label={`Move ${product.title} down`} disabled={productPosition === products.length - 1} onClick={() => props.onReorderProduct(category.id, product.id, 1)}>
                            <ArrowDown size={14} />
                          </button>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default CataloguePage;
