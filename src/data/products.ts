export interface ProductCategory {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  href: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: "head-protection",
    number: "01",
    name: "Head Protection",
    shortName: "Helmets",
    description:
      "Industrial safety helmets and head protection designed for demanding work environments.",
    image: "/images/products/head-protection.png",
    href: "/products/head-protection",
  },
  {
    id: "foot-protection",
    number: "02",
    name: "Foot Protection",
    shortName: "Safety Footwear",
    description:
      "Safety shoes, protective boots and gumboots for industrial and site environments.",
    image: "/images/products/foot-protection.png",
    href: "/products/foot-protection",
  },
  {
    id: "body-ppe",
    number: "03",
    name: "Body & PPE",
    shortName: "PPE",
    description:
      "Coveralls, gloves, safety vests and fall-protection equipment for workplace safety.",
    image: "/images/products/body-ppe.png",
    href: "/products/body-ppe",
  },
  {
    id: "eye-ear-respiratory",
    number: "04",
    name: "Eye, Ear & Respiratory",
    shortName: "Protection",
    description:
      "Protective eyewear, hearing protection, masks and respirators for workplace hazards.",
    image: "/images/products/eye-ear-respiratory.png",
    href: "/products/eye-ear-respiratory",
  },
  {
    id: "road-site-safety",
    number: "05",
    name: "Road & Site Safety",
    shortName: "Site Safety",
    description:
      "Traffic cones, barricades, warning signage and essential site-safety products.",
    image: "/images/products/road-site-safety.png",
    href: "/products/road-site-safety",
  },
  {
    id: "power-tools",
    number: "06",
    name: "Power Tools",
    shortName: "Power Tools",
    description:
      "Professional drills, grinders, cutters and other industrial power tools.",
    image: "/images/products/power-tools.png",
    href: "/products/power-tools",
  },
  {
    id: "hand-tools",
    number: "07",
    name: "Hand Tools",
    shortName: "Hand Tools",
    description:
      "Spanners, pliers, screwdrivers, hammers and other professional hand tools.",
    image: "/images/products/hand-tools.png",
    href: "/products/hand-tools",
  },
  {
    id: "steel-hardware",
    number: "08",
    name: "Steel & Hardware",
    shortName: "Hardware",
    description:
      "Steel and hardware products supplied according to your industrial requirements.",
    image: "/images/products/steel-hardware.png",
    href: "/products/steel-hardware",
  },
];