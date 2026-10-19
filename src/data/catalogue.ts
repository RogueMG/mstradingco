/**
 * Starter catalogue. The site renders this when no Sanity projectId is set,
 * and scripts/build-seed.ts turns it into sanity/seed.ndjson.
 *
 * Keep this file free of imports so Node can run it directly.
 * Image paths are relative to /public.
 */

export interface StarterCategory {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
}

export interface StarterBrand {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  confirmed: boolean;
  logo: string;
}

export interface StarterIndustry {
  slug: string;
  title: string;
  label: string;
  summary: string;
  image: string;
}

export interface StarterProduct {
  slug: string;
  title: string;
  category: string;
  brand?: string;
  summary: string;
}

export const starterCategories: StarterCategory[] = [
  {
    slug: "head-protection",
    title: "Head Protection",
    eyebrow: "Helmets",
    summary:
      "Industrial safety helmets and head protection designed for demanding work environments.",
    image: "/images/products/head-protection.png",
  },
  {
    slug: "foot-protection",
    title: "Foot Protection",
    eyebrow: "Safety Footwear",
    summary:
      "Safety shoes, protective boots and gumboots for industrial and site environments.",
    image: "/images/products/foot-protection.png",
  },
  {
    slug: "body-ppe",
    title: "Body & PPE",
    eyebrow: "PPE",
    summary:
      "Coveralls, gloves, safety vests and fall-protection equipment for workplace safety.",
    image: "/images/products/body-ppe.png",
  },
  {
    slug: "eye-ear-respiratory",
    title: "Eye, Ear & Respiratory",
    eyebrow: "Protection",
    summary:
      "Protective eyewear, hearing protection, masks and respirators for workplace hazards.",
    image: "/images/products/eye-ear-respiratory.png",
  },
  {
    slug: "road-site-safety",
    title: "Road & Site Safety",
    eyebrow: "Site Safety",
    summary:
      "Traffic cones, barricades, warning signage and essential site-safety products.",
    image: "/images/products/road-site-safety.png",
  },
  {
    slug: "power-tools",
    title: "Power Tools",
    eyebrow: "Power Tools",
    summary:
      "Professional drills, grinders, cutters and other industrial power tools.",
    image: "/images/products/power-tools.png",
  },
  {
    slug: "hand-tools",
    title: "Hand Tools",
    eyebrow: "Hand Tools",
    summary:
      "Spanners, pliers, screwdrivers, hammers and other professional hand tools.",
    image: "/images/products/hand-tools.png",
  },
  {
    slug: "steel-hardware",
    title: "Steel & Hardware",
    eyebrow: "Hardware",
    summary:
      "Steel and hardware products supplied according to your industrial requirements.",
    image: "/images/products/steel-hardware.png",
  },
];

export const starterBrands: StarterBrand[] = [
  {
    slug: "udyogi",
    name: "Udyogi",
    tagline: "Safety PPE",
    description:
      "General industrial safety and personal protective equipment.",
    confirmed: true,
    logo: "/images/brands/udyogi.png",
  },
  {
    slug: "3m",
    name: "3M",
    tagline: "PPE & Protection",
    description:
      "PPE, respiratory protection and hearing protection.",
    confirmed: true,
    logo: "/images/brands/3m.png",
  },
  {
    slug: "allen-cooper",
    name: "Allen Cooper",
    tagline: "Safety Footwear",
    description:
      "Industrial safety footwear and protective equipment.",
    confirmed: true,
    logo: "/images/brands/allen-cooper.png",
  },
  {
    slug: "tiger",
    name: "Tiger Industrial Safety Gear",
    tagline: "Industrial Safety",
    description:
      "Industrial safety gear and workplace protection products.",
    confirmed: true,
    logo: "/images/brands/tiger.png",
  },
  {
    slug: "safe-dot",
    name: "Safe Dot",
    tagline: "Safety Footwear",
    description:
      "Safety footwear and workplace protection products.",
    confirmed: true,
    logo: "/images/brands/safe-dot.png",
  },
  {
    slug: "fortune",
    name: "Fortune",
    tagline: "Foot Protection",
    description:
      "Protective footwear and industrial gumboots.",
    confirmed: true,
    logo: "/images/brands/fortune.png",
  },
  {
    slug: "karam",
    name: "Karam",
    tagline: "Fall Protection",
    description:
      "Fall protection and personal protective equipment.",
    confirmed: true,
    logo: "/images/brands/karam.png",
  },
  {
    slug: "bosch",
    name: "Bosch",
    tagline: "Power Tools",
    description:
      "Professional power tools for industrial applications.",
    confirmed: true,
    logo: "/images/brands/bosch.png",
  },
  {
    slug: "taparia",
    name: "Taparia",
    tagline: "Hand Tools",
    description:
      "Professional hand tools for industrial and workplace use.",
    confirmed: true,
    logo: "/images/brands/taparia.png",
  },
  {
    slug: "tvs",
    name: "TVS",
    tagline: "To Be Confirmed",
    description:
      "Product relationship to be confirmed by MS Trading Co.",
    confirmed: false,
    logo: "/images/brands/tvs.png",
  },
  {
    slug: "jsw-steel",
    name: "JSW Steel",
    tagline: "To Be Confirmed",
    description:
      "Product relationship to be confirmed by MS Trading Co.",
    confirmed: false,
    logo: "/images/brands/jsw-steel.png",
  },
  {
    slug: "jindal-star",
    name: "Jindal Star",
    tagline: "To Be Confirmed",
    description:
      "Product relationship to be confirmed by MS Trading Co.",
    confirmed: false,
    logo: "/images/brands/jindal-star.png",
  },
];

export const starterIndustries: StarterIndustry[] = [
  {
    slug: "construction",
    title: "Construction",
    label: "Construction & Sites",
    summary:
      "Safety equipment, PPE and site essentials for construction teams and project environments.",
    image: "/images/industries/construction.png",
  },
  {
    slug: "manufacturing",
    title: "Manufacturing & Automobile",
    label: "Manufacturing",
    summary:
      "Workplace protection and industrial tools for manufacturing and automobile operations.",
    image: "/images/industries/manufacturing.png",
  },
  {
    slug: "oil-gas-power",
    title: "Oil, Gas & Power",
    label: "Energy",
    summary:
      "Industrial safety products for demanding energy, power and project environments.",
    image: "/images/industries/oil-gas-power.png",
  },
  {
    slug: "pharma-healthcare",
    title: "Pharma & Healthcare",
    label: "Healthcare",
    summary:
      "Protective equipment and workplace safety products for healthcare and pharmaceutical environments.",
    image: "/images/industries/pharma-healthcare.png",
  },
  {
    slug: "food-processing",
    title: "Food Processing",
    label: "Food Industry",
    summary:
      "Workplace safety and protective equipment for food-processing environments.",
    image: "/images/industries/food-processing.png",
  },
  {
    slug: "government-infrastructure",
    title: "Government & Infrastructure",
    label: "Infrastructure",
    summary:
      "Safety equipment and site products for infrastructure and public-sector requirements.",
    image: "/images/industries/government-infrastructure.png",
  },
  {
    slug: "warehousing-logistics",
    title: "Warehousing & Logistics",
    label: "Logistics",
    summary:
      "PPE and workplace safety products for warehouses, logistics operations and facilities.",
    image: "/images/industries/warehousing-logistics.png",
  },
];

// Product names and brands come from the develop branch's product list.
// Each uses its category image until real photography is supplied.
export const starterProducts: StarterProduct[] = [
  {
    slug: "industrial-safety-helmet",
    title: "Industrial Safety Helmet",
    category: "head-protection",
    brand: "udyogi",
    summary:
      "Protective industrial helmet suitable for workplace and site safety requirements.",
  },
  {
    slug: "safety-helmet",
    title: "Safety Helmet",
    category: "head-protection",
    brand: "3m",
    summary:
      "Industrial head protection designed for workplace safety applications.",
  },
  {
    slug: "safety-shoes",
    title: "Industrial Safety Shoes",
    category: "foot-protection",
    brand: "allen-cooper",
    summary:
      "Protective footwear designed for industrial workplace requirements.",
  },
  {
    slug: "safety-gumboots",
    title: "Safety Gumboots",
    category: "foot-protection",
    brand: "fortune",
    summary:
      "Protective gumboots for demanding industrial and site environments.",
  },
  {
    slug: "safety-coverall",
    title: "Industrial Safety Coverall",
    category: "body-ppe",
    brand: "udyogi",
    summary: "Workwear and protective clothing for industrial environments.",
  },
  {
    slug: "safety-gloves",
    title: "Industrial Safety Gloves",
    category: "body-ppe",
    brand: "3m",
    summary:
      "Protective hand equipment for industrial workplace applications.",
  },
  {
    slug: "safety-harness",
    title: "Fall Protection Harness",
    category: "body-ppe",
    brand: "karam",
    summary: "Fall protection equipment for working-at-height requirements.",
  },
  {
    slug: "safety-goggles",
    title: "Safety Goggles",
    category: "eye-ear-respiratory",
    brand: "3m",
    summary: "Protective eyewear for workplace safety applications.",
  },
  {
    slug: "ear-muffs",
    title: "Industrial Ear Muffs",
    category: "eye-ear-respiratory",
    brand: "3m",
    summary: "Hearing protection for high-noise industrial environments.",
  },
  {
    slug: "respirator",
    title: "Respiratory Protection",
    category: "eye-ear-respiratory",
    brand: "3m",
    summary:
      "Respiratory protection products for appropriate workplace applications.",
  },
  {
    slug: "traffic-cone",
    title: "Traffic Safety Cone",
    category: "road-site-safety",
    summary:
      "High-visibility traffic control equipment for roads and work sites.",
  },
  {
    slug: "safety-barricade",
    title: "Safety Barricade",
    category: "road-site-safety",
    summary:
      "Site safety equipment for controlled work zones and restricted areas.",
  },
  {
    slug: "professional-drill",
    title: "Professional Drill",
    category: "power-tools",
    brand: "bosch",
    summary:
      "Professional power tool for drilling and industrial applications.",
  },
  {
    slug: "angle-grinder",
    title: "Angle Grinder",
    category: "power-tools",
    brand: "bosch",
    summary:
      "Professional grinding tool for industrial and fabrication work.",
  },
  {
    slug: "cutting-tool",
    title: "Cutting Tool",
    category: "power-tools",
    brand: "bosch",
    summary:
      "Professional cutting equipment for suitable industrial applications.",
  },
  {
    slug: "combination-spanner",
    title: "Combination Spanner",
    category: "hand-tools",
    brand: "taparia",
    summary:
      "Professional hand tool for maintenance and mechanical applications.",
  },
  {
    slug: "combination-plier",
    title: "Combination Pliers",
    category: "hand-tools",
    brand: "taparia",
    summary:
      "General-purpose professional hand tool for workplace applications.",
  },
  {
    slug: "screwdriver-set",
    title: "Screwdriver Set",
    category: "hand-tools",
    brand: "taparia",
    summary: "Hand tool set for maintenance and workshop requirements.",
  },
];
