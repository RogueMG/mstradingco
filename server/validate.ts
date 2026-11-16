/** Small server-side validators. Every admin and public write goes through these. */
import { HttpError } from "./http";

type Issues = Record<string, string>;

export class Validator {
  issues: Issues = {};

  private body: Record<string, unknown>;

  constructor(body: unknown) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new HttpError(400, "Expected a JSON object.");
    }
    this.body = body as Record<string, unknown>;
  }

  has(field: string): boolean {
    return field in this.body && this.body[field] !== undefined;
  }

  raw(field: string): unknown {
    return this.body[field];
  }

  string(field: string, options: { required?: boolean; max?: number; min?: number; label?: string } = {}): string {
    const { required = false, max = 500, min = 0, label = field } = options;
    const value = this.body[field];

    if (value === undefined || value === null || value === "") {
      if (required) this.issues[field] = `${label} is required.`;
      return "";
    }

    if (typeof value !== "string") {
      this.issues[field] = `${label} must be text.`;
      return "";
    }

    const text = value.trim();

    if (required && text === "") this.issues[field] = `${label} is required.`;
    else if (text.length > max) this.issues[field] = `${label} must be ${max} characters or fewer.`;
    else if (text.length > 0 && text.length < min) this.issues[field] = `${label} must be at least ${min} characters.`;

    return text;
  }

  email(field: string, options: { required?: boolean; label?: string } = {}): string {
    const text = this.string(field, { ...options, max: 200 });
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      this.issues[field] = `${options.label ?? field} must be a valid email address.`;
    }
    return text;
  }

  boolean(field: string, fallback: boolean): boolean {
    const value = this.body[field];
    if (value === undefined) return fallback;
    if (typeof value !== "boolean") {
      this.issues[field] = `${field} must be true or false.`;
      return fallback;
    }
    return value;
  }

  integer(field: string, options: { required?: boolean; min?: number; max?: number; nullable?: boolean } = {}): number | null {
    const { required = false, min = -1_000_000, max = 1_000_000, nullable = false } = options;
    const value = this.body[field];

    if (value === undefined || value === null || value === "") {
      if (required && !nullable) this.issues[field] = `${field} is required.`;
      return null;
    }

    if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
      this.issues[field] = `${field} must be a whole number between ${min} and ${max}.`;
      return null;
    }

    return value;
  }

  stringArray(field: string, options: { maxItems?: number; maxLength?: number } = {}): string[] {
    const { maxItems = 50, maxLength = 200 } = options;
    const value = this.body[field];

    if (value === undefined || value === null) return [];

    if (!Array.isArray(value) || value.length > maxItems) {
      this.issues[field] = `${field} must be a list of up to ${maxItems} items.`;
      return [];
    }

    const items = value.map((item) => (typeof item === "string" ? item.trim() : null));

    if (items.some((item) => item === null || item.length > maxLength)) {
      this.issues[field] = `Each ${field} entry must be text of ${maxLength} characters or fewer.`;
      return [];
    }

    return (items as string[]).filter(Boolean);
  }

  /** Throws a 400 listing every problem found so far. */
  done(): void {
    if (Object.keys(this.issues).length > 0) {
      throw new HttpError(400, "Please check the highlighted fields.", this.issues);
    }
  }
}
