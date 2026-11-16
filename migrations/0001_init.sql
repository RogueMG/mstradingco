-- MS Trading Co. catalogue schema (Cloudflare D1 / SQLite).
--
-- Images are stored as either an R2 object key (uploads, served at /media/<key>)
-- or an external/site URL. Uploaded images also have a "-thumb" variant next to
-- the key (uploads/<id>.webp + uploads/<id>-thumb.webp).
-- Timestamps are ISO-8601 UTC strings.

CREATE TABLE categories (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  parent_id     INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
  slug          TEXT    NOT NULL,
  title         TEXT    NOT NULL,
  eyebrow       TEXT    NOT NULL DEFAULT '',
  summary       TEXT    NOT NULL DEFAULT '',
  image_key     TEXT,
  image_url     TEXT,
  image_alt     TEXT    NOT NULL DEFAULT '',
  image_width   INTEGER,
  image_height  INTEGER,
  show_on_home  INTEGER NOT NULL DEFAULT 1 CHECK (show_on_home IN (0, 1)),
  sort_order    INTEGER NOT NULL DEFAULT 100,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (parent_id IS NULL OR parent_id <> id)
);

-- Slugs are unique among siblings (top-level categories share parent 0).
CREATE UNIQUE INDEX categories_sibling_slug ON categories (ifnull(parent_id, 0), slug);
CREATE INDEX categories_parent_order ON categories (parent_id, sort_order);

CREATE TABLE brands (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  name          TEXT    NOT NULL,
  tagline       TEXT    NOT NULL DEFAULT '',
  description   TEXT    NOT NULL DEFAULT '',
  confirmed     INTEGER NOT NULL DEFAULT 1 CHECK (confirmed IN (0, 1)),
  in_house      INTEGER NOT NULL DEFAULT 0 CHECK (in_house IN (0, 1)),
  logo_key      TEXT,
  logo_url      TEXT,
  logo_alt      TEXT    NOT NULL DEFAULT '',
  logo_width    INTEGER,
  logo_height   INTEGER,
  sort_order    INTEGER NOT NULL DEFAULT 100,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE products (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  slug            TEXT    NOT NULL,
  title           TEXT    NOT NULL,
  summary         TEXT    NOT NULL DEFAULT '',
  -- Sanitised HTML (p, h3, ul/li, strong, em, br) from the admin editor.
  description     TEXT    NOT NULL DEFAULT '',
  brand_id        INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  key_features    TEXT    NOT NULL DEFAULT '[]', -- JSON array of strings
  specifications  TEXT    NOT NULL DEFAULT '[]', -- JSON array of {label, value}
  variants        TEXT    NOT NULL DEFAULT '[]', -- JSON array of strings
  is_sample       INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
  published       INTEGER NOT NULL DEFAULT 1 CHECK (published IN (0, 1)),
  sort_order      INTEGER NOT NULL DEFAULT 100,
  created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- A product slug is unique within its category. The API also rejects a product
-- slug that equals a sibling category's slug, so /products/<path> is unambiguous.
CREATE UNIQUE INDEX products_category_slug ON products (category_id, slug);
CREATE INDEX products_category_order ON products (category_id, published, sort_order);
CREATE INDEX products_brand ON products (brand_id);

CREATE TABLE product_images (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_key   TEXT,
  image_url   TEXT,
  alt         TEXT    NOT NULL,
  width       INTEGER,
  height      INTEGER,
  sort_order  INTEGER NOT NULL DEFAULT 0, -- 0 = main image
  CHECK (image_key IS NOT NULL OR image_url IS NOT NULL)
);

CREATE INDEX product_images_product_order ON product_images (product_id, sort_order);
CREATE INDEX product_images_key ON product_images (image_key);

CREATE TABLE industries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  label         TEXT    NOT NULL DEFAULT '',
  summary       TEXT    NOT NULL DEFAULT '',
  image_key     TEXT,
  image_url     TEXT,
  image_alt     TEXT    NOT NULL DEFAULT '',
  image_width   INTEGER,
  image_height  INTEGER,
  show_on_home  INTEGER NOT NULL DEFAULT 1 CHECK (show_on_home IN (0, 1)),
  sort_order    INTEGER NOT NULL DEFAULT 100,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE enquiries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  company       TEXT    NOT NULL DEFAULT '',
  email         TEXT    NOT NULL,
  phone         TEXT    NOT NULL DEFAULT '',
  interest      TEXT    NOT NULL DEFAULT '',
  message       TEXT    NOT NULL DEFAULT '',
  source_page   TEXT    NOT NULL DEFAULT '',
  status        TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  -- 'sent', 'failed' or 'off' (email notifications not switched on yet).
  email_status  TEXT    NOT NULL DEFAULT 'off',
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX enquiries_status_created ON enquiries (status, created_at DESC);

-- Per-IP enquiry rate limit. The key is a salted hash, never the raw IP.
CREATE TABLE rate_limits (
  key           TEXT    PRIMARY KEY,
  window_start  INTEGER NOT NULL, -- unix seconds
  count         INTEGER NOT NULL
);

-- Site-wide facts editable in the admin (one JSON document per key).
CREATE TABLE settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
