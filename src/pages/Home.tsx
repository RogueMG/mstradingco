import Hero from "../sections/home/Hero";
import ProductCategories from "../sections/home/ProductCategories";
import WhyChooseUs from "../sections/home/WhyChooseUs";
import BrandsPreview from "../sections/home/BrandsPreview";
import IndustriesPreview from "../sections/home/IndustriesPreview";
import ClientTrust from "../sections/home/ClientTrust";
import FinalCTA from "../sections/home/FinalCTA";
import { usePageMeta } from "../lib/usePageMeta";

function Home() {
  usePageMeta();

  return (
    <>
      <Hero />
      <ProductCategories />
      <WhyChooseUs />
      <BrandsPreview />
      <IndustriesPreview />
      <ClientTrust />
      <FinalCTA />
    </>
  );
}

export default Home;
