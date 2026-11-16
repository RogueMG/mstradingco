import { lazy } from "react";
import { useParams } from "react-router";

import PageLoading from "../components/ui/PageLoading";
import { useTree } from "../lib/content/hooks";
import { classifyPath } from "../lib/content/tree";
import NotFound from "./NotFound";
import Products from "./Products";

const ProductPage = lazy(() => import("./ProductPage"));

/**
 * Resolves /products/<cat>/<sub>/…/<product> using the cached category tree:
 * category paths open the catalogue on that category, product paths open the
 * product page, anything else is not found.
 */
function Catalogue() {
  const path = (useParams()["*"] ?? "").replace(/^\/+|\/+$/g, "");
  const tree = useTree();

  if (!path) return <Products path="" />;

  if (tree.status === "loading") return <PageLoading />;

  // The catalogue page shows the error state with a retry button.
  if (tree.status === "error") return <Products path={path} />;

  const match = classifyPath(tree.data, path);

  if (!match) return <NotFound />;

  return match.kind === "product" ? <ProductPage path={path} /> : <Products path={path} />;
}

export default Catalogue;
