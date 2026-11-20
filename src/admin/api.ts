import type {
  AdminBrand,
  AdminCategory,
  AdminEnquiry,
  AdminIndustry,
  AdminProduct,
  AdminTree,
  EnquiryStatus,
  UploadResult,
} from "../../shared/admin";
import type { PrivateSettings, SiteSettings } from "../../shared/site";

/** An API error with the server's per-field messages, if any. */
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const response = await fetch(`/api/admin/${path}`, {
    method,
    headers: body && !isForm ? { "Content-Type": "application/json" } : undefined,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string; details?: Record<string, string> };

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error ??
        (response.status === 403
          ? "Your admin session has expired. Reload the page to sign in again."
          : `Request failed (${response.status}).`),
      data.details ?? {},
    );
  }

  return data as T;
}

export type CategoryInput = Omit<AdminCategory, "id" | "order" | "updatedAt">;
export type ProductInput = Omit<AdminProduct, "id" | "order" | "updatedAt">;
export type BrandInput = Omit<AdminBrand, "id" | "order">;
export type IndustryInput = Omit<AdminIndustry, "id" | "order">;
export interface Settings {
  site: SiteSettings;
  private: PrivateSettings;
}

export const adminApi = {
  me: () => request<{ email: string }>("GET", "me"),
  tree: () => request<AdminTree>("GET", "tree"),

  createCategory: (input: CategoryInput) => request<AdminCategory>("POST", "categories", input),
  updateCategory: (id: number, input: Partial<CategoryInput>) => request<AdminCategory>("PATCH", `categories/${id}`, input),
  deleteCategory: (id: number) => request<void>("DELETE", `categories/${id}`),
  reorderCategories: (parentId: number | null, ids: number[]) => request<void>("POST", "categories/reorder", { parentId, ids }),

  product: (id: number) => request<AdminProduct>("GET", `products/${id}`),
  createProduct: (input: ProductInput) => request<AdminProduct>("POST", "products", input),
  updateProduct: (id: number, input: ProductInput) => request<AdminProduct>("PUT", `products/${id}`, input),
  setPublished: (id: number, published: boolean) => request<void>("POST", `products/${id}/published`, { published }),
  deleteProduct: (id: number) => request<void>("DELETE", `products/${id}`),
  reorderProducts: (categoryId: number, ids: number[]) => request<void>("POST", "products/reorder", { categoryId, ids }),

  upload: (form: FormData) => request<UploadResult>("POST", "uploads", form),

  brands: () => request<{ brands: AdminBrand[] }>("GET", "brands"),
  createBrand: (input: BrandInput) => request<AdminBrand>("POST", "brands", input),
  updateBrand: (id: number, input: BrandInput) => request<AdminBrand>("PUT", `brands/${id}`, input),
  deleteBrand: (id: number) => request<void>("DELETE", `brands/${id}`),
  reorderBrands: (ids: number[]) => request<void>("POST", "brands/reorder", { ids }),

  industries: () => request<{ industries: AdminIndustry[] }>("GET", "industries"),
  createIndustry: (input: IndustryInput) => request<AdminIndustry>("POST", "industries", input),
  updateIndustry: (id: number, input: IndustryInput) => request<AdminIndustry>("PUT", `industries/${id}`, input),
  deleteIndustry: (id: number) => request<void>("DELETE", `industries/${id}`),
  reorderIndustries: (ids: number[]) => request<void>("POST", "industries/reorder", { ids }),

  enquiries: (status: EnquiryStatus | "all") =>
    request<{ enquiries: AdminEnquiry[]; counts: Record<string, number> }>("GET", `enquiries?status=${status}`),
  setEnquiryStatus: (id: number, status: EnquiryStatus) => request<void>("PATCH", `enquiries/${id}`, { status }),

  settings: () => request<Settings>("GET", "settings"),
  saveSettings: (settings: Settings) => request<Settings>("PUT", "settings", settings),
};
