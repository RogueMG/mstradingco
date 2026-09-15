export interface Industry {
  id: string;
  number: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
}

export const industries: Industry[] = [
  {
    id: "construction",
    number: "01",
    name: "Construction",
    shortName: "Construction & Sites",
    description:
      "Safety equipment, PPE and site essentials for construction teams and project environments.",
    image: "/images/industries/construction.png",
  },
  {
    id: "manufacturing",
    number: "02",
    name: "Manufacturing & Automobile",
    shortName: "Manufacturing",
    description:
      "Workplace protection and industrial tools for manufacturing and automobile operations.",
    image: "/images/industries/manufacturing.png",
  },
  {
    id: "oil-gas-power",
    number: "03",
    name: "Oil, Gas & Power",
    shortName: "Energy",
    description:
      "Industrial safety products for demanding energy, power and project environments.",
    image: "/images/industries/oil-gas-power.png",
  },
  {
    id: "pharma-healthcare",
    number: "04",
    name: "Pharma & Healthcare",
    shortName: "Healthcare",
    description:
      "Protective equipment and workplace safety products for healthcare and pharmaceutical environments.",
    image: "/images/industries/pharma-healthcare.png",
  },
  {
    id: "food-processing",
    number: "05",
    name: "Food Processing",
    shortName: "Food Industry",
    description:
      "Workplace safety and protective equipment for food-processing environments.",
    image: "/images/industries/food-processing.png",
  },
  {
    id: "government-infrastructure",
    number: "06",
    name: "Government & Infrastructure",
    shortName: "Infrastructure",
    description:
      "Safety equipment and site products for infrastructure and public-sector requirements.",
    image: "/images/industries/government-infrastructure.png",
  },
  {
    id: "warehousing-logistics",
    number: "07",
    name: "Warehousing & Logistics",
    shortName: "Logistics",
    description:
      "PPE and workplace safety products for warehouses, logistics operations and facilities.",
    image: "/images/industries/warehousing-logistics.png",
  },
];