export type RepairPrice = string | null;

export interface ServicePricing {
  lcd: RepairPrice;
  battery: RepairPrice;
  chargingPort: RepairPrice;
  frontCamera: RepairPrice;
  backCamera: RepairPrice;
  backHousing: RepairPrice; // "Back Housing" for iPhone, "Back Glass" for Samsung
}

export interface PhoneModel {
  id: string;
  name: string;
  pricing: ServicePricing;
}

// ─── iPhone Pricing ─────────────────────────────────────────────────────────

export const iphoneModels: PhoneModel[] = [
  { id: "iphone-6",          name: "iPhone 6",           pricing: { lcd: "$29.99", battery: "$29.99", chargingPort: "$44.99", frontCamera: "$24.99", backCamera: "$19.99", backHousing: null } },
  { id: "iphone-6plus",      name: "iPhone 6+",          pricing: { lcd: "$34.99", battery: "$29.99", chargingPort: "$44.99", frontCamera: "$24.99", backCamera: "$19.99", backHousing: null } },
  { id: "iphone-6s",         name: "iPhone 6s",          pricing: { lcd: "$34.99", battery: "$29.99", chargingPort: "$44.99", frontCamera: "$24.99", backCamera: "$24.99", backHousing: null } },
  { id: "iphone-6splus",     name: "iPhone 6s+",         pricing: { lcd: "$34.99", battery: "$29.99", chargingPort: "$44.99", frontCamera: "$24.99", backCamera: "$29.99", backHousing: null } },
  { id: "iphone-7",          name: "iPhone 7",           pricing: { lcd: "$49.99", battery: "$29.99", chargingPort: "$44.99", frontCamera: "$24.99", backCamera: "$29.99", backHousing: null } },
  { id: "iphone-7plus",      name: "iPhone 7+",          pricing: { lcd: "$49.99", battery: "$29.99", chargingPort: "$44.99", frontCamera: "$24.99", backCamera: "$49.99", backHousing: null } },
  { id: "iphone-8",          name: "iPhone 8",           pricing: { lcd: "$59.99", battery: "$29.99", chargingPort: "$54.99", frontCamera: "$24.99", backCamera: "$49.99", backHousing: "$94.99" } },
  { id: "iphone-8plus",      name: "iPhone 8+",          pricing: { lcd: "$59.99", battery: "$29.99", chargingPort: "$54.99", frontCamera: "$24.99", backCamera: "$59.99", backHousing: "$94.99" } },
  { id: "iphone-se2",        name: "iPhone SE (2nd/3rd)", pricing: { lcd: "$59.99", battery: "$29.99", chargingPort: "$59.99", frontCamera: "$24.99", backCamera: "$49.99", backHousing: "$94.99" } },
  { id: "iphone-x",          name: "iPhone X",           pricing: { lcd: "$79.99", battery: "$39.99", chargingPort: "$69.99", frontCamera: "$34.99", backCamera: "$39.99", backHousing: "$109.99" } },
  { id: "iphone-xr",         name: "iPhone XR",          pricing: { lcd: "$79.99", battery: "$39.99", chargingPort: "$69.99", frontCamera: "$34.99", backCamera: "$49.99", backHousing: "$114.99" } },
  { id: "iphone-xs",         name: "iPhone XS",          pricing: { lcd: "$79.99", battery: "$39.99", chargingPort: "$69.99", frontCamera: "$34.99", backCamera: "$54.99", backHousing: "$119.99" } },
  { id: "iphone-xsmax",      name: "iPhone XS Max",      pricing: { lcd: "$89.99", battery: "$39.99", chargingPort: "$69.99", frontCamera: "$34.99", backCamera: "$54.99", backHousing: "$129.99" } },
  { id: "iphone-11",         name: "iPhone 11",          pricing: { lcd: "$79.99", battery: "$39.99", chargingPort: "$69.99", frontCamera: "$34.99", backCamera: "$49.99", backHousing: "$124.99" } },
  { id: "iphone-11pro",      name: "iPhone 11 Pro",      pricing: { lcd: "$79.99", battery: "$39.99", chargingPort: "$76.99", frontCamera: "$39.99", backCamera: "$69.99", backHousing: "$154.99" } },
  { id: "iphone-11promax",   name: "iPhone 11 Pro Max",  pricing: { lcd: "$94.99", battery: "$39.99", chargingPort: "$76.99", frontCamera: "$39.99", backCamera: "$69.99", backHousing: "$164.99" } },
  { id: "iphone-12mini",     name: "iPhone 12 Mini",     pricing: { lcd: "$94.99", battery: "$74.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: "$79.99", backHousing: "$229.99" } },
  { id: "iphone-12",         name: "iPhone 12",          pricing: { lcd: "$89.99", battery: "$74.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: "$79.99", backHousing: "$179.99" } },
  { id: "iphone-12pro",      name: "iPhone 12 Pro",      pricing: { lcd: "$89.99", battery: "$74.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: "$139.99", backHousing: "$189.99" } },
  { id: "iphone-12promax",   name: "iPhone 12 Pro Max",  pricing: { lcd: "$109.99", battery: "$79.99", chargingPort: "$99.99", frontCamera: "$69.99", backCamera: "$139.99", backHousing: "$219.99" } },
  { id: "iphone-13mini",     name: "iPhone 13 Mini",     pricing: { lcd: "$119.99", battery: "$99.99", chargingPort: "$99.99", frontCamera: "$94.99", backCamera: "$139.99", backHousing: "$209.99" } },
  { id: "iphone-13",         name: "iPhone 13",          pricing: { lcd: "$119.99", battery: "$99.99", chargingPort: "$99.99", frontCamera: "$94.99", backCamera: "$109.99", backHousing: "$219.99" } },
  { id: "iphone-13pro",      name: "iPhone 13 Pro",      pricing: { lcd: "$139.99", battery: "$119.99", chargingPort: "$119.99", frontCamera: "$114.99", backCamera: "$149.99", backHousing: "$239.99" } },
  { id: "iphone-13promax",   name: "iPhone 13 Pro Max",  pricing: { lcd: "$149.99", battery: "$129.99", chargingPort: "$129.99", frontCamera: "$119.99", backCamera: "$169.99", backHousing: "$244.99" } },
  { id: "iphone-14",         name: "iPhone 14",          pricing: { lcd: "$139.99", battery: "$109.99", chargingPort: "$129.99", frontCamera: "$109.99", backCamera: "$129.99", backHousing: "$74.99" } },
  { id: "iphone-14plus",     name: "iPhone 14+",         pricing: { lcd: "$149.99", battery: "$119.99", chargingPort: "$129.99", frontCamera: "$114.99", backCamera: "$119.99", backHousing: "$84.99" } },
  { id: "iphone-14pro",      name: "iPhone 14 Pro",      pricing: { lcd: "$149.99", battery: "$159.99", chargingPort: "$189.99", frontCamera: "$179.99", backCamera: "$229.99", backHousing: "$289.99" } },
  { id: "iphone-14promax",   name: "iPhone 14 Pro Max",  pricing: { lcd: "$159.99", battery: "$169.99", chargingPort: "$169.99", frontCamera: "$179.99", backCamera: "$239.99", backHousing: "$299.99" } },
  { id: "iphone-15",         name: "iPhone 15",          pricing: { lcd: "$149.99", battery: "$119.99", chargingPort: "$129.99", frontCamera: "$119.99", backCamera: "$129.99", backHousing: "$84.99" } },
  { id: "iphone-15plus",     name: "iPhone 15+",         pricing: { lcd: "$159.99", battery: "$119.99", chargingPort: "$129.99", frontCamera: "$119.99", backCamera: "$129.99", backHousing: "$84.99" } },
  { id: "iphone-15pro",      name: "iPhone 15 Pro",      pricing: { lcd: "$159.99", battery: "$129.99", chargingPort: "$149.99", frontCamera: "$139.99", backCamera: "$149.99", backHousing: "$89.99" } },
  { id: "iphone-15promax",   name: "iPhone 15 Pro Max",  pricing: { lcd: "$169.99", battery: "$139.99", chargingPort: "$149.99", frontCamera: "$139.99", backCamera: "$159.99", backHousing: "$94.99" } },
  { id: "iphone-16",         name: "iPhone 16",          pricing: { lcd: "$159.99", battery: "$149.99", chargingPort: "$169.99", frontCamera: "$159.99", backCamera: "$169.99", backHousing: "$119.99" } },
  { id: "iphone-16plus",     name: "iPhone 16+",         pricing: { lcd: "$169.99", battery: "$159.99", chargingPort: "$179.99", frontCamera: "$159.99", backCamera: "$189.99", backHousing: "$129.99" } },
  { id: "iphone-16pro",      name: "iPhone 16 Pro",      pricing: { lcd: "$179.99", battery: "$149.99", chargingPort: "$179.99", frontCamera: "$219.99", backCamera: "$159.99", backHousing: "$119.99" } },
  { id: "iphone-16promax",   name: "iPhone 16 Pro Max",  pricing: { lcd: "$209.99", battery: "$169.99", chargingPort: "$189.99", frontCamera: "$169.99", backCamera: "$179.99", backHousing: "$129.99" } },
  { id: "iphone-16e",        name: "iPhone 16e",         pricing: { lcd: "$139.99", battery: "$169.99", chargingPort: "$149.99", frontCamera: "$129.99", backCamera: "$159.99", backHousing: "$94.99" } },
  { id: "iphone-17",         name: "iPhone 17",          pricing: { lcd: "$189.99", battery: "$159.99", chargingPort: "$169.99", frontCamera: "$174.99", backCamera: "$174.99", backHousing: "$119.99" } },
  { id: "iphone-17air",      name: "iPhone 17 Air",      pricing: { lcd: "$279.99", battery: "$299.99", chargingPort: "$259.99", frontCamera: "$269.99", backCamera: "$299.99", backHousing: "$219.99" } },
  { id: "iphone-17pro",      name: "iPhone 17 Pro",      pricing: { lcd: "$199.99", battery: "$259.99", chargingPort: "$249.99", frontCamera: "$249.99", backCamera: "$289.99", backHousing: "$159.99" } },
  { id: "iphone-17promax",   name: "iPhone 17 Pro Max",  pricing: { lcd: "$219.99", battery: "$259.99", chargingPort: "$259.99", frontCamera: "$259.99", backCamera: "$299.99", backHousing: "$169.99" } },
  { id: "iphone-17e",        name: "iPhone 17e",         pricing: { lcd: "$139.99", battery: null, chargingPort: null, frontCamera: null, backCamera: null, backHousing: null } },
];

// ─── Samsung S-Series Pricing ────────────────────────────────────────────────
// Note: LCD/Battery/ChargingPort/FrontCamera/BackCamera prices include Back Glass

export const samsungSSeriesModels: PhoneModel[] = [
  { id: "s8",            name: "Galaxy S8",            pricing: { lcd: "$149.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$49.99", backHousing: "$24.99" } },
  { id: "s8plus",        name: "Galaxy S8+",           pricing: { lcd: "$179.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$49.99", backHousing: "$24.99" } },
  { id: "s9",            name: "Galaxy S9",            pricing: { lcd: "$159.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$54.99", backHousing: "$24.99" } },
  { id: "s9plus",        name: "Galaxy S9+",           pricing: { lcd: "$169.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$54.99", backHousing: "$24.99" } },
  { id: "s10e",          name: "Galaxy S10e",          pricing: { lcd: "$159.99", battery: "$49.99", chargingPort: null,     frontCamera: "$49.99", backCamera: "$59.99", backHousing: "$24.99" } },
  { id: "s10",           name: "Galaxy S10",           pricing: { lcd: "$184.99", battery: "$49.99", chargingPort: null,     frontCamera: "$49.99", backCamera: "$64.99", backHousing: "$24.99" } },
  { id: "s10plus",       name: "Galaxy S10+",          pricing: { lcd: "$229.99", battery: "$49.99", chargingPort: null,     frontCamera: "$54.99", backCamera: "$64.99", backHousing: "$29.99" } },
  { id: "s20",           name: "Galaxy S20 5G",        pricing: { lcd: "$209.99", battery: "$49.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$89.99", backHousing: "$29.99" } },
  { id: "s20plus",       name: "Galaxy S20+ 5G",       pricing: { lcd: "$219.99", battery: "$49.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$89.99", backHousing: "$29.99" } },
  { id: "s20ultra",      name: "Galaxy S20 Ultra 5G",  pricing: { lcd: "$239.99", battery: "$54.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$104.99", backHousing: "$29.99" } },
  { id: "s20fe",         name: "Galaxy S20 FE 4G/5G",  pricing: { lcd: "$149.99", battery: "$49.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$54.99", backHousing: "$29.99" } },
  { id: "s21",           name: "Galaxy S21 5G",        pricing: { lcd: "$179.99", battery: "$49.99", chargingPort: "$74.99", frontCamera: "$49.99", backCamera: "$89.99", backHousing: "$29.99" } },
  { id: "s21plus",       name: "Galaxy S21+ 5G",       pricing: { lcd: "$179.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$49.99", backCamera: "$89.99", backHousing: "$34.99" } },
  { id: "s21ultra",      name: "Galaxy S21 Ultra 5G",  pricing: { lcd: "$249.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$54.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s21fe",         name: "Galaxy S21 FE 5G",     pricing: { lcd: "$189.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$74.99", backCamera: null,     backHousing: "$29.99" } },
  { id: "s22",           name: "Galaxy S22 5G",        pricing: { lcd: "$229.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$54.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s22plus",       name: "Galaxy S22+ 5G",       pricing: { lcd: "$229.99", battery: "$59.99", chargingPort: "$74.99", frontCamera: "$54.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s22ultra",      name: "Galaxy S22 Ultra 5G",  pricing: { lcd: "$289.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$74.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s23",           name: "Galaxy S23 5G",        pricing: { lcd: "$219.99", battery: "$54.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$29.99" } },
  { id: "s23plus",       name: "Galaxy S23+ 5G",       pricing: { lcd: "$219.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$29.99" } },
  { id: "s23ultra",      name: "Galaxy S23 Ultra 5G",  pricing: { lcd: "$289.99", battery: "$54.99", chargingPort: "$79.99", frontCamera: "$74.99", backCamera: "$149.99", backHousing: "$39.99" } },
  { id: "s23fe",         name: "Galaxy S23 FE",        pricing: { lcd: "$189.99", battery: "$54.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s24",           name: "Galaxy S24 5G",        pricing: { lcd: "$209.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s24plus",       name: "Galaxy S24+ 5G",       pricing: { lcd: "$229.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$39.99" } },
  { id: "s24ultra",      name: "Galaxy S24 Ultra 5G",  pricing: { lcd: "$289.99", battery: "$64.99", chargingPort: "$79.99", frontCamera: "$74.99", backCamera: null,     backHousing: "$39.99" } },
  { id: "s24fe",         name: "Galaxy S24 FE",        pricing: { lcd: "$199.99", battery: "$54.99", chargingPort: "$69.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$34.99" } },
  { id: "s25",           name: "Galaxy S25",           pricing: { lcd: "$219.99", battery: "$59.99", chargingPort: "$69.99", frontCamera: "$69.99", backCamera: null,     backHousing: "$39.99" } },
  { id: "s25edge",       name: "Galaxy S25 Edge",      pricing: { lcd: "$349.99", battery: null,     chargingPort: "$89.99", frontCamera: "$89.99", backCamera: null,     backHousing: "$59.99" } },
  { id: "s25plus",       name: "Galaxy S25+",          pricing: { lcd: "$239.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$89.99", backCamera: null,     backHousing: "$39.99" } },
  { id: "s25ultra",      name: "Galaxy S25 Ultra",     pricing: { lcd: "$299.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$89.99", backCamera: null,     backHousing: "$39.99" } },
  { id: "s25fe",         name: "Galaxy S25 FE",        pricing: { lcd: "$199.99", battery: "$54.99", chargingPort: "$69.99", frontCamera: null,     backCamera: null,     backHousing: "$39.99" } },
  { id: "s26",           name: "Galaxy S26",           pricing: { lcd: "$249.99", battery: null,     chargingPort: null,     frontCamera: null,     backCamera: null,     backHousing: null } },
  { id: "s26plus",       name: "Galaxy S26+",          pricing: { lcd: null,      battery: null,     chargingPort: null,     frontCamera: null,     backCamera: null,     backHousing: null } },
  { id: "s26ultra",      name: "Galaxy S26 Ultra",     pricing: { lcd: "$339.99", battery: null,     chargingPort: null,     frontCamera: null,     backCamera: null,     backHousing: null } },
];

// ─── Samsung Note-Series Pricing ─────────────────────────────────────────────

export const samsungNoteSeriesModels: PhoneModel[] = [
  { id: "note8",         name: "Galaxy Note 8",        pricing: { lcd: "$179.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$54.99", backHousing: "$24.99" } },
  { id: "note9",         name: "Galaxy Note 9",        pricing: { lcd: "$194.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$64.99", backHousing: "$24.99" } },
  { id: "note10",        name: "Galaxy Note 10",       pricing: { lcd: "$209.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$64.99", backHousing: "$24.99" } },
  { id: "note10plus",    name: "Galaxy Note 10+ 5G",   pricing: { lcd: "$249.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$89.99", backHousing: "$29.99" } },
  { id: "note20",        name: "Galaxy Note 20 5G",    pricing: { lcd: "$179.99", battery: "$54.99", chargingPort: "$59.99", frontCamera: "$54.99", backCamera: "$94.99", backHousing: "$29.99" } },
  { id: "note20ultra",   name: "Galaxy Note 20 Ultra 5G", pricing: { lcd: "$299.99", battery: "$54.99", chargingPort: "$59.99", frontCamera: "$54.99", backCamera: "$104.99", backHousing: "$34.99" } },
];

export const samsungModels: PhoneModel[] = [...samsungSSeriesModels, ...samsungNoteSeriesModels];

// ─── Service Labels ──────────────────────────────────────────────────────────

export type ServiceKey = keyof ServicePricing;

export const iphoneServiceLabels: Record<ServiceKey, string> = {
  lcd:          "Screen (LCD)",
  battery:      "Battery",
  chargingPort: "Charging Port",
  frontCamera:  "Front Camera",
  backCamera:   "Back Camera",
  backHousing:  "Back Housing",
};

export const samsungServiceLabels: Record<ServiceKey, string> = {
  lcd:          "Screen Repair",
  battery:      "Battery",
  chargingPort: "Charging Port",
  frontCamera:  "Front Camera",
  backCamera:   "Back Camera",
  backHousing:  "Back Glass Only",
};

// For Samsung, these services include back glass replacement
export const samsungIncludesBackGlass: ServiceKey[] = ["lcd", "battery", "chargingPort", "frontCamera", "backCamera"];
