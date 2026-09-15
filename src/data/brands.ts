export type BrandStatus = "confirmed" | "pending";

export interface Brand {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string;
  status: BrandStatus;
}

export const brands: Brand[] = [
  {
    id: "udyogi",
    name: "Udyogi",
    category: "Safety PPE",
    description: "General industrial safety and personal protective equipment.",
    logo: "/images/brands/udyogi.png",
    status: "confirmed",
  },
  {
    id: "3m",
    name: "3M",
    category: "PPE & Protection",
    description: "PPE, respiratory protection and hearing protection.",
    logo: "/images/brands/3m.png",
    status: "confirmed",
  },
  {
    id: "allen-cooper",
    name: "Allen Cooper",
    category: "Safety Footwear",
    description: "Industrial safety footwear and protective equipment.",
    logo: "/images/brands/allen-cooper.png",
    status: "confirmed",
  },
  {
    id: "tiger",
    name: "Tiger Industrial Safety Gear",
    category: "Industrial Safety",
    description: "Industrial safety gear and workplace protection products.",
    logo: "/images/brands/tiger.png",
    status: "confirmed",
  },
  {
    id: "safe-dot",
    name: "Safe Dot",
    category: "Safety Footwear",
    description: "Safety footwear and workplace protection products.",
    logo: "/images/brands/safe-dot.png",
    status: "confirmed",
  },
  {
    id: "fortune",
    name: "Fortune",
    category: "Foot Protection",
    description: "Protective footwear and industrial gumboots.",
    logo: "/images/brands/fortune.png",
    status: "confirmed",
  },
  {
    id: "karam",
    name: "Karam",
    category: "Fall Protection",
    description: "Fall protection and personal protective equipment.",
    logo: "/images/brands/karam.png",
    status: "confirmed",
  },
  {
    id: "bosch",
    name: "Bosch",
    category: "Power Tools",
    description: "Professional power tools for industrial applications.",
    logo: "/images/brands/bosch.png",
    status: "confirmed",
  },
  {
    id: "taparia",
    name: "Taparia",
    category: "Hand Tools",
    description: "Professional hand tools for industrial and workplace use.",
    logo: "/images/brands/taparia.png",
    status: "confirmed",
  },
  {
    id: "tvs",
    name: "TVS",
    category: "To Be Confirmed",
    description: "Product relationship to be confirmed by MS Trading Co.",
    logo: "/images/brands/tvs.png",
    status: "pending",
  },
  {
    id: "jsw-steel",
    name: "JSW Steel",
    category: "To Be Confirmed",
    description: "Product relationship to be confirmed by MS Trading Co.",
    logo: "/images/brands/jsw-steel.png",
    status: "pending",
  },
  {
    id: "jindal-star",
    name: "Jindal Star",
    category: "To Be Confirmed",
    description: "Product relationship to be confirmed by MS Trading Co.",
    logo: "/images/brands/jindal-star.png",
    status: "pending",
  },
];