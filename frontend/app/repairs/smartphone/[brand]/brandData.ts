export type Model = { name: string; slug: string };

export type Issue = { label: string; icon: string };

export type BrandData = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  brandImage: string;   // small logo (header-images/)
  heroImage: string;    // big product shot (public/brands/)
  models: Model[];
  issues: Issue[];
  faqs: { q: string; a: string }[];
};

function m(names: string[]): Model[] {
  return names.map((name) => ({
    name,
    slug: name
      .toLowerCase()
      .replace(/\+/g, "plus")
      .replace(/[()]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim(),
  }));
}

export const brands: Record<string, BrandData> = {
  /* ── iPhone ── */
  iphone: {
    slug: "iphone",
    name: "iPhone",
    tagline: "Trusted to fix any iPhone",
    description:
      "As an Independent Repair Provider for Apple®, our trusted experts are trained to get your broken iPhone back up and running fast using Apple parts, tools, and equipment.",
    brandImage: "/header-images/phone-repair/iphone.png",
    heroImage: "/brands/iphone.png",
    models: m([
      "iPhone 17", "iPhone 17 Air", "iPhone 17 Pro", "iPhone 17 Pro Max",
      "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
      "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
      "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 14 Plus",
      "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max", "iPhone 13 Mini",
      "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max", "iPhone 12 Mini",
      "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
      "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
      "iPhone 8", "iPhone 8 Plus", "iPhone 7", "iPhone 7 Plus",
      "iPhone 6", "iPhone 6 Plus", "iPhone 6s", "iPhone 6s Plus",
      "iPhone 5", "iPhone 5C", "iPhone 5S", "iPhone SE",
    ]),
    issues: [
      { label: "Screen repair", icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Face ID not working", icon: "ScanFace" },
      { label: "Charging port", icon: "PlugZap" },
      { label: "Back glass", icon: "Layers" },
      { label: "Camera repair", icon: "Camera" },
      { label: "Speaker / mic", icon: "Volume2" },
      { label: "Water damage", icon: "Droplets" },
    ],
    faqs: [
      { q: "How much does an iPhone repair cost?", a: "iPhone repair prices vary by model and damage type. Screen replacement starts at a low flat rate while newer Pro models cost more. We offer free diagnostics and a lowest-price guarantee — bring it in for a quote before any work starts." },
      { q: "How long does an iPhone repair take?", a: "Most iPhone screen and battery repairs are done in under an hour. More complex repairs like Face ID or back-glass replacement may take a few hours. We'll give you an accurate estimate on the spot." },
      { q: "Will my data be safe during repair?", a: "Yes. Our technicians never access your personal data. We recommend backing up to iCloud before any repair as a precaution, but your photos, contacts, and apps remain safe on the device." },
    ],
  },

  /* ── Samsung ── */
  samsung: {
    slug: "samsung",
    name: "Samsung",
    tagline: "Trusted to fix any Samsung Galaxy",
    description:
      "From Galaxy S to Galaxy Z Fold, our certified technicians handle every Samsung repair with OEM-quality parts, free diagnostics, and same-day service at 700+ locations.",
    brandImage: "/header-images/phone-repair/samsung.png",
    heroImage: "/brands/samsung2.png",
    models: m([
      "Samsung Galaxy S26 Ultra", "Samsung Galaxy S26+", "Samsung Galaxy S26",
      "Samsung Galaxy Z Fold7", "Samsung Galaxy Z Flip7 FE", "Samsung Galaxy Z Flip7",
      "Samsung Galaxy S25 Ultra", "Samsung Galaxy S25+", "Samsung Galaxy S25",
      "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24+", "Samsung Galaxy S24",
      "Samsung Galaxy Z Fold6", "Samsung Galaxy Z Flip6",
      "Samsung Galaxy S23 Ultra 5G", "Samsung Galaxy S23+", "Samsung Galaxy S23", "Samsung Galaxy S23 FE",
      "Samsung Galaxy Z Fold5", "Samsung Galaxy Z Fold4", "Samsung Galaxy Z Fold2 5G",
      "Samsung Galaxy Z Flip4", "Samsung Galaxy Z Flip3 5G", "Samsung Galaxy Z Flip",
      "Samsung Galaxy S22 Ultra 5G", "Samsung Galaxy S22+", "Samsung Galaxy S22",
      "Samsung Galaxy S21 Ultra 5G", "Samsung Galaxy S21+", "Samsung Galaxy S21", "Samsung Galaxy S21 FE",
      "Samsung Galaxy S20 Ultra", "Samsung Galaxy S20+", "Samsung Galaxy S20", "Samsung Galaxy S20 FE",
      "Samsung Galaxy Note 20 Ultra", "Samsung Galaxy Note 20",
      "Samsung Galaxy Note 10 Plus", "Samsung Galaxy Note 10",
      "Samsung Galaxy S10+", "Samsung Galaxy S10", "Samsung Galaxy S10e", "Samsung Galaxy S10 5G",
      "Samsung Galaxy A54 5G", "Samsung Galaxy A53 5G", "Samsung Galaxy A52 5G",
      "Samsung Galaxy A42 5G", "Samsung Galaxy A32 5G", "Samsung Galaxy A23",
      "Samsung Galaxy A22 5G", "Samsung Galaxy A21", "Samsung Galaxy A20",
      "Samsung Galaxy A71", "Samsung Galaxy A70", "Samsung Galaxy A51", "Samsung Galaxy A50",
      "Samsung Galaxy A12", "Samsung Galaxy A11", "Samsung Galaxy A10",
      "Samsung Galaxy A05", "Samsung Galaxy A03s", "Samsung Galaxy A02", "Samsung Galaxy A01",
    ]),
    issues: [
      { label: "Screen repair", icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port", icon: "PlugZap" },
      { label: "Fold hinge", icon: "Wrench" },
      { label: "Back glass", icon: "Layers" },
      { label: "Camera repair", icon: "Camera" },
      { label: "Water damage", icon: "Droplets" },
      { label: "S-Pen issues", icon: "Pen" },
    ],
    faqs: [
      { q: "What does a Samsung Galaxy repair cost?", a: "Samsung repair costs depend on your model and the damage. S-series and Z-series foldables cost more to repair than A-series models. We offer free diagnostics and a price-match guarantee so you always get the best deal." },
      { q: "Can you repair Samsung foldable phones?", a: "Yes! Our technicians are trained to repair Galaxy Z Fold and Z Flip models, including the delicate hinge mechanism and inner display. Bring it in for a free diagnostic first." },
      { q: "How long will my Samsung repair take?", a: "Most screen and battery swaps are done in 1–2 hours. Complex repairs like Z Fold hinge or water damage may take longer. We'll keep you updated every step of the way." },
    ],
  },

  /* ── Google ── */
  google: {
    slug: "google",
    name: "Google Pixel",
    tagline: "Trusted to fix any Google Pixel",
    description:
      "Pixel hardware broken? Our technicians know Pixel inside and out. Fast, quality repairs with OEM-grade parts, free diagnostics, and a full 1-year warranty at every location.",
    brandImage: "/header-images/phone-repair/google.png",
    heroImage: "/brands/google-pixel.png",
    models: m([
      "Google Pixel 10 Pro Fold", "Google Pixel 10 Pro XL", "Google Pixel 10 Pro", "Google Pixel 10",
      "Google Pixel 9 Pro Fold", "Google Pixel 9 Pro XL", "Google Pixel 9 Pro", "Google Pixel 9",
      "Google Pixel 8 Pro", "Google Pixel 8",
      "Google Pixel 7 Pro", "Google Pixel 7", "Google Pixel 7a",
      "Google Pixel 6 Pro", "Google Pixel 6", "Google Pixel 6a",
      "Google Pixel 5", "Google Pixel 5a",
      "Google Pixel 4 XL", "Google Pixel 4", "Google Pixel 4a 5G", "Google Pixel 4a",
      "Google Pixel 3 XL", "Google Pixel 3", "Google Pixel 3a XL", "Google Pixel 3a",
      "Google Pixel 2 XL", "Google Pixel 2", "Google Pixel XL",
    ]),
    issues: [
      { label: "Screen repair", icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port", icon: "PlugZap" },
      { label: "Camera repair", icon: "Camera" },
      { label: "Back glass", icon: "Layers" },
      { label: "Speaker / mic", icon: "Volume2" },
      { label: "Water damage", icon: "Droplets" },
      { label: "Fingerprint sensor", icon: "Fingerprint" },
    ],
    faqs: [
      { q: "How much does a Google Pixel repair cost?", a: "Pixel repair pricing varies by model and damage. Pixel 6/7/8/9/10 screens are more involved than older models. We always run a free diagnostic first so you know the exact cost before any repair begins." },
      { q: "Can you fix the Pixel camera?", a: "Absolutely. The Pixel camera is one of the best on any phone, and we have the parts and expertise to restore it fully — both the main array and the front selfie camera." },
      { q: "Is my Pixel still under warranty after repair?", a: "All our repairs come with a 1-year Jesup limited warranty. If the same issue returns within a year, we'll fix it at no charge. We use OEM-quality parts that won't void your remaining manufacturer warranty." },
    ],
  },

  /* ── Motorola ── */
  motorola: {
    slug: "motorola",
    name: "Motorola",
    tagline: "Trusted to fix any Motorola smartphone",
    description:
      "Broken Motorola? Our certified technicians repair every Moto model fast — with quality parts, free diagnostics, and a 1-year limited warranty at 700+ locations nationwide.",
    brandImage: "/header-images/phone-repair/motorola.png",
    heroImage: "/brands/motrols.png",
    models: m([
      "Motorola Razr+ (2024)", "Motorola Razr 2024", "Motorola Razr 40 (2023)", "Motorola Razr+",
      "Motorola One 5G Ace", "Motorola One 5G",
      "Motorola Moto Z4", "Motorola Moto Z3",
      "Motorola Moto Surf E6", "Motorola Moto Rugby Go E5 Play", "Motorola Moto Rugby E5",
      "Motorola Moto G9 Power", "Motorola Moto G9 Play",
      "Motorola Moto G8 Stylus", "Motorola Moto G8 Power", "Motorola Moto G7 Power",
      "Motorola Moto G Stylus 5G", "Motorola Moto G Pure",
      "Motorola Moto G Power", "Motorola Moto G Play", "Motorola Moto G Power (2021)",
    ]),
    issues: [
      { label: "Screen repair", icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port", icon: "PlugZap" },
      { label: "Camera repair", icon: "Camera" },
      { label: "Back cover", icon: "Layers" },
      { label: "Speaker / mic", icon: "Volume2" },
      { label: "Water damage", icon: "Droplets" },
      { label: "Wi-Fi / Bluetooth", icon: "Wifi" },
    ],
    faqs: [
      { q: "How much does a Motorola repair cost?", a: "Motorola repair prices depend on your model and the type of damage. Entry-level Moto G models are among the most affordable to repair. We offer free diagnostics and a lowest-price guarantee on every job." },
      { q: "How long do Motorola repairs take?", a: "Most screen and battery repairs are finished in under an hour. More complex fixes like water damage may take longer. Our technicians give you an accurate time estimate before work begins." },
      { q: "Why choose Jesup for Motorola repairs?", a: "Jesup has 700+ locations staffed by certified technicians. We use OEM-quality parts, offer a 1-year limited warranty, and guarantee the lowest price. Your Motorola is in expert hands from drop-off to pick-up." },
    ],
  },

  /* ── LG ── */
  lg: {
    slug: "lg",
    name: "LG",
    tagline: "Trusted to fix any LG smartphone",
    description:
      "LG discontinued but still going strong? We still repair them. Our technicians carry quality parts for a wide range of LG models and fix them fast at competitive prices.",
    brandImage: "/header-images/phone-repair/LG.png",
    heroImage: "/brands/lg.png",
    models: m([
      "LG G8 ThinQ", "LG G8X ThinQ", "LG G7 One", "LG G7 ThinQ",
      "LG Velvet 5G", "LG Q70",
      "LG V60 ThinQ 5G", "LG V50", "LG V40",
    ]),
    issues: [
      { label: "Screen repair", icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port", icon: "PlugZap" },
      { label: "Camera repair", icon: "Camera" },
      { label: "Back glass", icon: "Layers" },
      { label: "Speaker / mic", icon: "Volume2" },
      { label: "Water damage", icon: "Droplets" },
      { label: "Buttons / volume", icon: "SlidersHorizontal" },
    ],
    faqs: [
      { q: "Can you still repair LG phones after discontinuation?", a: "Yes. Even though LG exited the phone market, we still stock quality parts for most popular LG models and repair them at competitive prices. Bring it in for a free diagnostic." },
      { q: "How much does an LG repair cost?", a: "LG repair prices depend on the model and damage type. Because LG phones are older, parts are often very affordable. We'll give you a free quote before any work begins." },
      { q: "Is it worth repairing an LG phone?", a: "Absolutely — especially for flagships like the V60 or Velvet that still perform great. A screen or battery replacement can give your LG years more life at a fraction of the cost of a new device." },
    ],
  },
};
