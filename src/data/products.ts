export interface ProductItem {
  id: string;
  name: string;
  brand?: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface ProductCategory {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  href: string;
  items: ProductItem[];
}

export const productCategories: ProductCategory[] = [
  {
    id: "head-protection",
    number: "01",
    name: "Head Protection",
    shortName: "Head Protection",
    description:
      "Industrial safety helmets and head protection equipment for demanding workplace environments.",
    image: "/images/categories/head-protection.png",
    href: "/products/head-protection",
    items: [
      {
        id: "industrial-safety-helmet",
        name: "Industrial Safety Helmet",
        brand: "Udyogi",
        description:
          "Protective industrial helmet suitable for workplace and site safety requirements.",
        image: "/images/products/head-protection/industrial-safety-helmet.png",
        featured: true,
      },
      {
        id: "safety-helmet",
        name: "Safety Helmet",
        brand: "3M",
        description:
          "Industrial head protection designed for workplace safety applications.",
        image: "/images/products/head-protection/safety-helmet.png",
      },
    ],
  },

  {
    id: "foot-protection",
    number: "02",
    name: "Foot Protection",
    shortName: "Foot Protection",
    description:
      "Safety shoes, protective boots and industrial gumboots for workplace and site applications.",
    image: "/images/categories/foot-protection.png",
    href: "/products/foot-protection",
    items: [
      {
        id: "safety-shoes",
        name: "Industrial Safety Shoes",
        brand: "Allen Cooper",
        description:
          "Protective footwear designed for industrial workplace requirements.",
        image: "/images/products/foot-protection/safety-shoes.png",
        featured: true,
      },
      {
        id: "safety-gumboots",
        name: "Safety Gumboots",
        brand: "Fortune",
        description:
          "Protective gumboots for demanding industrial and site environments.",
        image: "/images/products/foot-protection/safety-gumboots.png",
      },
    ],
  },

  {
    id: "body-ppe",
    number: "03",
    name: "Body & PPE",
    shortName: "Body & PPE",
    description:
      "Coveralls, gloves, high-visibility clothing and fall-protection equipment.",
    image: "/images/categories/body-ppe.png",
    href: "/products/body-ppe",
    items: [
      {
        id: "safety-coverall",
        name: "Industrial Safety Coverall",
        brand: "Udyogi",
        description:
          "Workwear and protective clothing for industrial environments.",
        image: "/images/products/body-ppe/safety-coverall.png",
        featured: true,
      },
      {
        id: "safety-gloves",
        name: "Industrial Safety Gloves",
        brand: "3M",
        description:
          "Protective hand equipment for industrial workplace applications.",
        image: "/images/products/body-ppe/safety-gloves.png",
      },
      {
        id: "safety-harness",
        name: "Fall Protection Harness",
        brand: "Karam",
        description:
          "Fall protection equipment for working-at-height requirements.",
        image: "/images/products/body-ppe/safety-harness.png",
      },
    ],
  },

  {
    id: "eye-ear-respiratory",
    number: "04",
    name: "Eye, Ear & Respiratory",
    shortName: "Eye / Ear / Respiratory",
    description:
      "Protection for eyes, hearing and respiratory safety across industrial environments.",
    image: "/images/categories/eye-ear-respiratory.png",
    href: "/products/eye-ear-respiratory",
    items: [
      {
        id: "safety-goggles",
        name: "Safety Goggles",
        brand: "3M",
        description:
          "Protective eyewear for workplace safety applications.",
        image: "/images/products/eye-ear-respiratory/safety-goggles.png",
        featured: true,
      },
      {
        id: "ear-muffs",
        name: "Industrial Ear Muffs",
        brand: "3M",
        description:
          "Hearing protection for high-noise industrial environments.",
        image: "/images/products/eye-ear-respiratory/ear-muffs.png",
      },
      {
        id: "respirator",
        name: "Respiratory Protection",
        brand: "3M",
        description:
          "Respiratory protection products for appropriate workplace applications.",
        image: "/images/products/eye-ear-respiratory/respirator.png",
      },
    ],
  },

  {
    id: "road-site-safety",
    number: "05",
    name: "Road & Site Safety",
    shortName: "Road & Site Safety",
    description:
      "Traffic cones, barricades and warning products for road and construction site safety.",
    image: "/images/categories/road-site-safety.png",
    href: "/products/road-site-safety",
    items: [
      {
        id: "traffic-cone",
        name: "Traffic Safety Cone",
        description:
          "High-visibility traffic control equipment for roads and work sites.",
        image: "/images/products/road-site-safety/traffic-cone.png",
        featured: true,
      },
      {
        id: "safety-barricade",
        name: "Safety Barricade",
        description:
          "Site safety equipment for controlled work zones and restricted areas.",
        image: "/images/products/road-site-safety/safety-barricade.png",
      },
    ],
  },

  {
    id: "power-tools",
    number: "06",
    name: "Power Tools",
    shortName: "Power Tools",
    description:
      "Professional drills, grinders and cutters for industrial and project requirements.",
    image: "/images/categories/power-tools.png",
    href: "/products/power-tools",
    items: [
      {
        id: "professional-drill",
        name: "Professional Drill",
        brand: "Bosch",
        description:
          "Professional power tool for drilling and industrial applications.",
        image: "/images/products/power-tools/professional-drill.png",
        featured: true,
      },
      {
        id: "angle-grinder",
        name: "Angle Grinder",
        brand: "Bosch",
        description:
          "Professional grinding tool for industrial and fabrication work.",
        image: "/images/products/power-tools/angle-grinder.png",
      },
      {
        id: "cutting-tool",
        name: "Cutting Tool",
        brand: "Bosch",
        description:
          "Professional cutting equipment for suitable industrial applications.",
        image: "/images/products/power-tools/cutting-tool.png",
      },
    ],
  },

  {
    id: "hand-tools",
    number: "07",
    name: "Hand Tools",
    shortName: "Hand Tools",
    description:
      "Professional spanners, pliers, screwdrivers and hammers for workplace use.",
    image: "/images/categories/hand-tools.png",
    href: "/products/hand-tools",
    items: [
      {
        id: "combination-spanner",
        name: "Combination Spanner",
        brand: "Taparia",
        description:
          "Professional hand tool for maintenance and mechanical applications.",
        image: "/images/products/hand-tools/combination-spanner.png",
        featured: true,
      },
      {
        id: "combination-plier",
        name: "Combination Pliers",
        brand: "Taparia",
        description:
          "General-purpose professional hand tool for workplace applications.",
        image: "/images/products/hand-tools/combination-plier.png",
      },
      {
        id: "screwdriver-set",
        name: "Screwdriver Set",
        brand: "Taparia",
        description:
          "Hand tool set for maintenance and workshop requirements.",
        image: "/images/products/hand-tools/screwdriver-set.png",
      },
    ],
  },

  {
    id: "steel-hardware",
    number: "08",
    name: "Steel & Hardware",
    shortName: "Steel & Hardware",
    description:
      "Industrial steel and hardware requirements supplied based on project and procurement needs.",
    image: "/images/categories/steel-hardware.png",
    href: "/products/steel-hardware",
    items: [],
  },
];