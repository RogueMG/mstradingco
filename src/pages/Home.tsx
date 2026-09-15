import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../sections/home/Hero";
import ProductCategories from "../sections/home/ProductCategories";
import WhyChooseUs from "../sections/home/WhyChooseUs";
import BrandsPreview from "../sections/home/BrandsPreview";
import IndustriesPreview from "../sections/home/IndustriesPreview";
import ClientTrust from "../sections/home/ClientTrust";
import FinalCTA from "../sections/home/FinalCTA";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ProductCategories />
        <WhyChooseUs />
        <BrandsPreview />
        <IndustriesPreview />
        <ClientTrust />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default Home;