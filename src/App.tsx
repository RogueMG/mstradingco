import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/*" element={<Navigate to="/products" replace />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;