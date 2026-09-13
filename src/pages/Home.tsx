import Navbar from "../components/layout/Navbar";
import Hero from "../sections/home/Hero";
import ProductCategories from "../sections/home/ProductCategories";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProductCategories />
      </main>
    </>
  );
}

export default Home;