import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import PageLoading from "./components/ui/PageLoading";

const About = lazy(() => import("./pages/About"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const Brands = lazy(() => import("./pages/Brands"));
const Industries = lazy(() => import("./pages/Industries"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
// The admin panel is its own bundle, loaded only at /admin.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageLoading />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products/*" element={<Catalogue />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
