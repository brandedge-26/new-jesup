// Repair pricing for iPhone and Samsung models.
// Model names must exactly match the keys used in AppointmentContext's modelsByBrand.

export interface ServicePricing {
  lcd: string | null;
  battery: string | null;
  chargingPort: string | null;
  frontCamera: string | null;
  backCamera: string | null;
  backHousing: string | null; // "Back Housing" for iPhone, "Back Glass" for Samsung
}

// ─── iPhone ──────────────────────────────────────────────────────────────────

export const iphonePricing: Record<string, ServicePricing> = {
  "iPhone 17 Pro Max":      { lcd: "$219.99", battery: "$259.99", chargingPort: "$259.99", frontCamera: "$259.99", backCamera: "$299.99", backHousing: "$169.99" },
  "iPhone 17 Pro":          { lcd: "$199.99", battery: "$259.99", chargingPort: "$249.99", frontCamera: "$249.99", backCamera: "$289.99", backHousing: "$159.99" },
  "iPhone 17 Air":          { lcd: "$279.99", battery: "$299.99", chargingPort: "$259.99", frontCamera: "$269.99", backCamera: "$299.99", backHousing: "$219.99" },
  "iPhone 17":              { lcd: "$189.99", battery: "$159.99", chargingPort: "$169.99", frontCamera: "$174.99", backCamera: "$174.99", backHousing: "$119.99" },
  "iPhone 17E":             { lcd: "$139.99", battery: null,      chargingPort: null,      frontCamera: null,      backCamera: null,      backHousing: null      },
  "iPhone 16 Pro Max":      { lcd: "$209.99", battery: "$169.99", chargingPort: "$189.99", frontCamera: "$169.99", backCamera: "$179.99", backHousing: "$129.99" },
  "iPhone 16 Pro":          { lcd: "$179.99", battery: "$149.99", chargingPort: "$179.99", frontCamera: "$219.99", backCamera: "$159.99", backHousing: "$119.99" },
  "iPhone 16 Plus":         { lcd: "$169.99", battery: "$159.99", chargingPort: "$179.99", frontCamera: "$159.99", backCamera: "$189.99", backHousing: "$129.99" },
  "iPhone 16":              { lcd: "$159.99", battery: "$149.99", chargingPort: "$169.99", frontCamera: "$159.99", backCamera: "$169.99", backHousing: "$119.99" },
  "iPhone 16e":             { lcd: "$139.99", battery: "$169.99", chargingPort: "$149.99", frontCamera: "$129.99", backCamera: "$159.99", backHousing: "$94.99"  },
  "iPhone 15 Pro Max":      { lcd: "$169.99", battery: "$139.99", chargingPort: "$149.99", frontCamera: "$139.99", backCamera: "$159.99", backHousing: "$94.99"  },
  "iPhone 15 Pro":          { lcd: "$159.99", battery: "$129.99", chargingPort: "$149.99", frontCamera: "$139.99", backCamera: "$149.99", backHousing: "$89.99"  },
  "iPhone 15 Plus":         { lcd: "$159.99", battery: "$119.99", chargingPort: "$129.99", frontCamera: "$119.99", backCamera: "$129.99", backHousing: "$84.99"  },
  "iPhone 15":              { lcd: "$149.99", battery: "$119.99", chargingPort: "$129.99", frontCamera: "$119.99", backCamera: "$129.99", backHousing: "$84.99"  },
  "iPhone 14 Pro Max":      { lcd: "$159.99", battery: "$169.99", chargingPort: "$169.99", frontCamera: "$179.99", backCamera: "$239.99", backHousing: "$299.99" },
  "iPhone 14 Pro":          { lcd: "$149.99", battery: "$159.99", chargingPort: "$189.99", frontCamera: "$179.99", backCamera: "$229.99", backHousing: "$289.99" },
  "iPhone 14 Plus":         { lcd: "$149.99", battery: "$119.99", chargingPort: "$129.99", frontCamera: "$114.99", backCamera: "$119.99", backHousing: "$84.99"  },
  "iPhone 14":              { lcd: "$139.99", battery: "$109.99", chargingPort: "$129.99", frontCamera: "$109.99", backCamera: "$129.99", backHousing: "$74.99"  },
  "iPhone 13 Pro Max":      { lcd: "$149.99", battery: "$129.99", chargingPort: "$129.99", frontCamera: "$119.99", backCamera: "$169.99", backHousing: "$244.99" },
  "iPhone 13 Pro":          { lcd: "$139.99", battery: "$119.99", chargingPort: "$119.99", frontCamera: "$114.99", backCamera: "$149.99", backHousing: "$239.99" },
  "iPhone 13 Mini":         { lcd: "$119.99", battery: "$99.99",  chargingPort: "$99.99",  frontCamera: "$94.99",  backCamera: "$139.99", backHousing: "$209.99" },
  "iPhone 13":              { lcd: "$119.99", battery: "$99.99",  chargingPort: "$99.99",  frontCamera: "$94.99",  backCamera: "$109.99", backHousing: "$219.99" },
  "iPhone 12 Pro Max":      { lcd: "$109.99", battery: "$79.99",  chargingPort: "$99.99",  frontCamera: "$69.99",  backCamera: "$139.99", backHousing: "$219.99" },
  "iPhone 12 Pro":          { lcd: "$89.99",  battery: "$74.99",  chargingPort: "$79.99",  frontCamera: "$69.99",  backCamera: "$139.99", backHousing: "$189.99" },
  "iPhone 12 Mini":         { lcd: "$94.99",  battery: "$74.99",  chargingPort: "$79.99",  frontCamera: "$69.99",  backCamera: "$79.99",  backHousing: "$229.99" },
  "iPhone 12":              { lcd: "$89.99",  battery: "$74.99",  chargingPort: "$79.99",  frontCamera: "$69.99",  backCamera: "$79.99",  backHousing: "$179.99" },
  "iPhone 11 Pro Max":      { lcd: "$94.99",  battery: "$39.99",  chargingPort: "$76.99",  frontCamera: "$39.99",  backCamera: "$69.99",  backHousing: "$164.99" },
  "iPhone 11 Pro":          { lcd: "$79.99",  battery: "$39.99",  chargingPort: "$76.99",  frontCamera: "$39.99",  backCamera: "$69.99",  backHousing: "$154.99" },
  "iPhone 11":              { lcd: "$79.99",  battery: "$39.99",  chargingPort: "$69.99",  frontCamera: "$34.99",  backCamera: "$49.99",  backHousing: "$124.99" },
  "iPhone XS Max":          { lcd: "$89.99",  battery: "$39.99",  chargingPort: "$69.99",  frontCamera: "$34.99",  backCamera: "$54.99",  backHousing: "$129.99" },
  "iPhone XS":              { lcd: "$79.99",  battery: "$39.99",  chargingPort: "$69.99",  frontCamera: "$34.99",  backCamera: "$54.99",  backHousing: "$119.99" },
  "iPhone XR":              { lcd: "$79.99",  battery: "$39.99",  chargingPort: "$69.99",  frontCamera: "$34.99",  backCamera: "$49.99",  backHousing: "$114.99" },
  "iPhone X":               { lcd: "$79.99",  battery: "$39.99",  chargingPort: "$69.99",  frontCamera: "$34.99",  backCamera: "$39.99",  backHousing: "$109.99" },
  "iPhone SE (2nd/3rd Gen)":{ lcd: "$59.99",  battery: "$29.99",  chargingPort: "$59.99",  frontCamera: "$24.99",  backCamera: "$49.99",  backHousing: "$94.99"  },
  "iPhone 8 Plus":          { lcd: "$59.99",  battery: "$29.99",  chargingPort: "$54.99",  frontCamera: "$24.99",  backCamera: "$59.99",  backHousing: "$94.99"  },
  "iPhone 8":               { lcd: "$59.99",  battery: "$29.99",  chargingPort: "$54.99",  frontCamera: "$24.99",  backCamera: "$49.99",  backHousing: "$94.99"  },
  "iPhone 7 Plus":          { lcd: "$49.99",  battery: "$29.99",  chargingPort: "$44.99",  frontCamera: "$24.99",  backCamera: "$49.99",  backHousing: null      },
  "iPhone 7":               { lcd: "$49.99",  battery: "$29.99",  chargingPort: "$44.99",  frontCamera: "$24.99",  backCamera: "$29.99",  backHousing: null      },
  "iPhone 6s Plus":         { lcd: "$34.99",  battery: "$29.99",  chargingPort: "$44.99",  frontCamera: "$24.99",  backCamera: "$29.99",  backHousing: null      },
  "iPhone 6s":              { lcd: "$34.99",  battery: "$29.99",  chargingPort: "$44.99",  frontCamera: "$24.99",  backCamera: "$24.99",  backHousing: null      },
  "iPhone 6 Plus":          { lcd: "$34.99",  battery: "$29.99",  chargingPort: "$44.99",  frontCamera: "$24.99",  backCamera: "$19.99",  backHousing: null      },
  "iPhone 6":               { lcd: "$29.99",  battery: "$29.99",  chargingPort: "$44.99",  frontCamera: "$24.99",  backCamera: "$19.99",  backHousing: null      },
};

// ─── Samsung ─────────────────────────────────────────────────────────────────
// Note: LCD, Battery, ChargingPort, FrontCamera, BackCamera prices include Back Glass replacement.
// backHousing = Back Glass Only (standalone).

export const samsungPricing: Record<string, ServicePricing> = {
  "Galaxy S26 Ultra":     { lcd: "$339.99", battery: null,     chargingPort: null,     frontCamera: null,     backCamera: null,      backHousing: null     },
  "Galaxy S26+":          { lcd: null,      battery: null,     chargingPort: null,     frontCamera: null,     backCamera: null,      backHousing: null     },
  "Galaxy S26":           { lcd: "$249.99", battery: null,     chargingPort: null,     frontCamera: null,     backCamera: null,      backHousing: null     },
  "Galaxy S25 Ultra":     { lcd: "$299.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$89.99", backCamera: null,      backHousing: "$39.99" },
  "Galaxy S25 Edge":      { lcd: "$349.99", battery: null,     chargingPort: "$89.99", frontCamera: "$89.99", backCamera: null,      backHousing: "$59.99" },
  "Galaxy S25+":          { lcd: "$239.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$89.99", backCamera: null,      backHousing: "$39.99" },
  "Galaxy S25":           { lcd: "$219.99", battery: "$59.99", chargingPort: "$69.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$39.99" },
  "Galaxy S25 FE":        { lcd: "$199.99", battery: "$54.99", chargingPort: "$69.99", frontCamera: null,     backCamera: null,      backHousing: "$39.99" },
  "Galaxy S24 Ultra":     { lcd: "$289.99", battery: "$64.99", chargingPort: "$79.99", frontCamera: "$74.99", backCamera: null,      backHousing: "$39.99" },
  "Galaxy S24+":          { lcd: "$229.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$39.99" },
  "Galaxy S24":           { lcd: "$209.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S24 FE":        { lcd: "$199.99", battery: "$54.99", chargingPort: "$69.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S23 Ultra":     { lcd: "$289.99", battery: "$54.99", chargingPort: "$79.99", frontCamera: "$74.99", backCamera: "$149.99", backHousing: "$39.99" },
  "Galaxy S23+":          { lcd: "$219.99", battery: "$59.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$29.99" },
  "Galaxy S23":           { lcd: "$219.99", battery: "$54.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$29.99" },
  "Galaxy S23 FE":        { lcd: "$189.99", battery: "$54.99", chargingPort: "$79.99", frontCamera: "$69.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S22 Ultra":     { lcd: "$289.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$74.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S22+":          { lcd: "$229.99", battery: "$59.99", chargingPort: "$74.99", frontCamera: "$54.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S22":           { lcd: "$229.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$54.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S21 Ultra":     { lcd: "$249.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$54.99", backCamera: null,      backHousing: "$34.99" },
  "Galaxy S21+":          { lcd: "$179.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$49.99", backCamera: "$89.99",  backHousing: "$34.99" },
  "Galaxy S21":           { lcd: "$179.99", battery: "$49.99", chargingPort: "$74.99", frontCamera: "$49.99", backCamera: "$89.99",  backHousing: "$29.99" },
  "Galaxy S21 FE":        { lcd: "$189.99", battery: "$54.99", chargingPort: "$74.99", frontCamera: "$74.99", backCamera: null,      backHousing: "$29.99" },
  "Galaxy S20 Ultra":     { lcd: "$239.99", battery: "$54.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$104.99", backHousing: "$29.99" },
  "Galaxy S20+":          { lcd: "$219.99", battery: "$49.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$89.99",  backHousing: "$29.99" },
  "Galaxy S20":           { lcd: "$209.99", battery: "$49.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$89.99",  backHousing: "$29.99" },
  "Galaxy S20 FE":        { lcd: "$149.99", battery: "$49.99", chargingPort: "$69.99", frontCamera: "$54.99", backCamera: "$54.99",  backHousing: "$29.99" },
  "Galaxy S10+":          { lcd: "$229.99", battery: "$49.99", chargingPort: null,     frontCamera: "$54.99", backCamera: "$64.99",  backHousing: "$29.99" },
  "Galaxy S10":           { lcd: "$184.99", battery: "$49.99", chargingPort: null,     frontCamera: "$49.99", backCamera: "$64.99",  backHousing: "$24.99" },
  "Galaxy S10e":          { lcd: "$159.99", battery: "$49.99", chargingPort: null,     frontCamera: "$49.99", backCamera: "$59.99",  backHousing: "$24.99" },
  "Galaxy S9+":           { lcd: "$169.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$54.99",  backHousing: "$24.99" },
  "Galaxy S9":            { lcd: "$159.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$54.99",  backHousing: "$24.99" },
  "Galaxy S8+":           { lcd: "$179.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$49.99",  backHousing: "$24.99" },
  "Galaxy S8":            { lcd: "$149.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$49.99",  backHousing: "$24.99" },
  "Galaxy Note 20 Ultra": { lcd: "$299.99", battery: "$54.99", chargingPort: "$59.99", frontCamera: "$54.99", backCamera: "$104.99", backHousing: "$34.99" },
  "Galaxy Note 20":       { lcd: "$179.99", battery: "$54.99", chargingPort: "$59.99", frontCamera: "$54.99", backCamera: "$94.99",  backHousing: "$29.99" },
  "Galaxy Note 10+":      { lcd: "$249.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$89.99",  backHousing: "$29.99" },
  "Galaxy Note 10":       { lcd: "$209.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$64.99",  backHousing: "$24.99" },
  "Galaxy Note 9":        { lcd: "$194.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$54.99", backCamera: "$64.99",  backHousing: "$24.99" },
  "Galaxy Note 8":        { lcd: "$179.99", battery: "$49.99", chargingPort: "$54.99", frontCamera: "$49.99", backCamera: "$54.99",  backHousing: "$24.99" },
  // A-series: not in pricing sheet
  "Galaxy A55":           null as unknown as ServicePricing,
  "Galaxy A35":           null as unknown as ServicePricing,
  "Galaxy A15":           null as unknown as ServicePricing,
};

// ─── Damage type → service key mapping ───────────────────────────────────────

export type ServiceKey = keyof ServicePricing;

export const damageToServices: Record<string, ServiceKey[]> = {
  "Cracked / Broken Screen":     ["lcd"],
  "Battery Not Lasting":         ["battery"],
  "Charging Port Issue":         ["chargingPort"],
  "Camera Not Working":          ["frontCamera", "backCamera"],
  "Back Cover / Housing Damage": ["backHousing"],
  // Direct service name mappings (iPhone)
  "Screen (LCD)":                ["lcd"],
  "Back Housing":                ["backHousing"],
  // Direct service name mappings (Samsung)
  "Screen Repair":               ["lcd"],
  "Back Glass Only":             ["backHousing"],
  // Shared direct labels
  "Battery":                     ["battery"],
  "Charging Port":               ["chargingPort"],
  "Front Camera":                ["frontCamera"],
  "Back Camera":                 ["backCamera"],
};

export const serviceLabelsIphone: Record<ServiceKey, string> = {
  lcd:          "Screen (LCD)",
  battery:      "Battery",
  chargingPort: "Charging Port",
  frontCamera:  "Front Camera",
  backCamera:   "Back Camera",
  backHousing:  "Back Housing",
};

export const serviceLabelsSamsung: Record<ServiceKey, string> = {
  lcd:          "Screen Repair",
  battery:      "Battery",
  chargingPort: "Charging Port",
  frontCamera:  "Front Camera",
  backCamera:   "Back Camera",
  backHousing:  "Back Glass Only",
};

// Samsung: these services include back glass
export const samsungComboServices: ServiceKey[] = ["lcd", "battery", "chargingPort", "frontCamera", "backCamera"];

export function getPricing(brand: string, model: string): ServicePricing | null {
  if (brand === "Apple (iPhone)") return iphonePricing[model] ?? null;
  if (brand === "Samsung") return samsungPricing[model] ?? null;
  return null;
}
