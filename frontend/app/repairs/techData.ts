export type TechIssue = { label: string; icon: string };

export type TechData = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  issues: TechIssue[];
  models: string[]; // brand names or device families
  faqs: { q: string; a: string }[];
};

export const techDevices: Record<string, TechData> = {

  /* ── iPad ── */
  ipads: {
    slug: "ipads",
    name: "iPad",
    tagline: "Trusted to fix any iPad",
    description:
      "Cracked screen? Dead battery? Our certified technicians repair every iPad model fast — with Apple-quality parts, free diagnostics, and a 1-year limited warranty at 700+ locations.",
    heroImage: "/tech-repair/ipad.png",
    models: [
      "iPad Pro 13-inch (M4)",
      "iPad Pro 11-inch (M4)",
      "iPad Air 13-inch (M2)",
      "iPad Air 11-inch (M2)",
      "iPad mini 7",
      "iPad mini 6",
      "iPad (10th generation)",
      "iPad (9th generation)",
      "iPad (8th generation)",
      "iPad (7th generation)",
      "iPad Pro 12.9-inch (6th gen)",
      "iPad Pro 12.9-inch (5th gen)",
      "iPad Pro 11-inch (4th gen)",
      "iPad Pro 11-inch (3rd gen)",
      "iPad Air (5th generation)",
      "iPad Air (4th generation)",
    ],
    issues: [
      { label: "Screen repair",       icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port",       icon: "PlugZap" },
      { label: "Back glass",          icon: "Layers" },
      { label: "Camera repair",       icon: "Camera" },
      { label: "Speaker / mic",       icon: "Volume2" },
      { label: "Water damage",        icon: "Droplets" },
      { label: "Button / Home",       icon: "SlidersHorizontal" },
    ],
    faqs: [
      { q: "How much does an iPad repair cost?", a: "iPad repair prices vary by model and the type of damage. Screen replacements on older iPads start at a low flat rate, while newer iPad Pro models cost more due to the display technology. We offer free diagnostics and a lowest-price guarantee." },
      { q: "How long does an iPad repair take?", a: "Most iPad screen and battery repairs are completed the same day, often within a few hours. More complex repairs like water damage or back-glass replacement may take longer. We'll give you an accurate time estimate upfront." },
      { q: "Is my data safe during an iPad repair?", a: "Absolutely. Our technicians never access your personal data. We recommend backing up to iCloud before any repair as a precaution, but your apps, photos, and settings are safe on the device." },
    ],
  },

  /* ── Tablet (Android/other) ── */
  tablets: {
    slug: "tablets",
    name: "Tablet",
    tagline: "Trusted to fix any tablet",
    description:
      "Samsung Tab, Kindle, Surface, or any other tablet — our certified technicians fix them all with quality parts, free diagnostics, and a 1-year limited warranty.",
    heroImage: "/tech-repair/tablet.png",
    models: [
      "Samsung Galaxy Tab S10 Ultra",
      "Samsung Galaxy Tab S10+",
      "Samsung Galaxy Tab S10",
      "Samsung Galaxy Tab S9 Ultra",
      "Samsung Galaxy Tab S9+",
      "Samsung Galaxy Tab A9+",
      "Microsoft Surface Pro 11",
      "Microsoft Surface Pro 10",
      "Microsoft Surface Go 4",
      "Google Pixel Tablet",
      "Amazon Fire HD 10",
      "Amazon Fire HD 8",
      "Lenovo Tab P12",
      "Lenovo Tab M10 Plus",
    ],
    issues: [
      { label: "Screen repair",       icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port",       icon: "PlugZap" },
      { label: "Camera repair",       icon: "Camera" },
      { label: "Back cover",          icon: "Layers" },
      { label: "Speaker / mic",       icon: "Volume2" },
      { label: "Water damage",        icon: "Droplets" },
      { label: "Wi-Fi / Bluetooth",   icon: "Wifi" },
    ],
    faqs: [
      { q: "What tablets do you repair?", a: "We repair virtually all tablets — Samsung Galaxy Tab, Microsoft Surface, Amazon Fire, Google Pixel Tablet, Lenovo, and more. If it has a screen, we can fix it. Bring it in for a free diagnostic." },
      { q: "How much does a tablet repair cost?", a: "Tablet repair pricing depends on the brand, model, and damage type. Budget tablets are typically the most affordable to fix. We offer free diagnostics and a lowest-price guarantee on every repair." },
      { q: "Can you fix a tablet with a shattered screen?", a: "Yes! A shattered screen is our most common tablet repair. We carry high-quality replacement screens for most popular models and can typically complete the repair the same day." },
    ],
  },

  /* ── Laptop / Computer ── */
  "laptop-computers": {
    slug: "laptop-computers",
    name: "Computer",
    tagline: "Trusted to fix any laptop or computer",
    description:
      "MacBook, Windows laptop, or desktop PC — our certified technicians diagnose and repair all computers fast, with quality parts, free diagnostics, and a 1-year limited warranty.",
    heroImage: "/tech-repair/computer.png",
    models: [
      "MacBook Pro 16-inch (M4 Pro/Max)",
      "MacBook Pro 14-inch (M4 Pro/Max)",
      "MacBook Air 15-inch (M3)",
      "MacBook Air 13-inch (M3)",
      "MacBook Air 13-inch (M2)",
      "iMac (24-inch, M3)",
      "Mac mini (M4)",
      "Windows Laptop (HP, Dell, Lenovo)",
      "Microsoft Surface Laptop 7",
      "Microsoft Surface Book",
      "Dell XPS 13 / XPS 15",
      "HP Spectre / Envy",
      "Lenovo ThinkPad / IdeaPad",
      "Asus ZenBook / VivoBook",
      "Gaming Laptop (Razer, ASUS ROG, MSI)",
      "Desktop PC (custom or pre-built)",
    ],
    issues: [
      { label: "Screen repair",       icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Keyboard repair",     icon: "Keyboard" },
      { label: "Charging port",       icon: "PlugZap" },
      { label: "Data recovery",       icon: "HardDrive" },
      { label: "Virus / malware",     icon: "ShieldAlert" },
      { label: "RAM / storage",       icon: "Cpu" },
      { label: "Overheating / fan",   icon: "Thermometer" },
    ],
    faqs: [
      { q: "Do you repair both Macs and Windows laptops?", a: "Yes — our technicians are certified to repair both Mac and Windows devices, including MacBook, iMac, HP, Dell, Lenovo, ASUS, Razer, and more. We also repair desktop PCs." },
      { q: "How much does a laptop repair cost?", a: "Laptop repair costs depend on the brand, model, and the issue. Screen replacements, battery swaps, and keyboard repairs are among the most common and affordable. We provide a free diagnostic before any work begins so you know the exact cost." },
      { q: "Can you recover data from a broken laptop?", a: "In many cases, yes. Our data recovery specialists can retrieve files from failed hard drives, damaged SSDs, or corrupted systems. We recommend bringing the device in as soon as possible for the best recovery outcomes." },
    ],
  },

  /* ── Gaming Console ── */
  "gaming-console": {
    slug: "gaming-console",
    name: "Gaming Console",
    tagline: "Trusted to fix any gaming console",
    description:
      "PlayStation, Xbox, or Nintendo — our technicians repair all major gaming consoles fast with quality parts, free diagnostics, and a 1-year limited warranty at 700+ locations.",
    heroImage: "/tech-repair/gaming.png",
    models: [
      "PlayStation 5",
      "PlayStation 5 Slim",
      "PlayStation 4 Pro",
      "PlayStation 4 Slim",
      "PlayStation 4",
      "Xbox Series X",
      "Xbox Series S",
      "Xbox One X",
      "Xbox One S",
      "Xbox One",
      "Nintendo Switch OLED",
      "Nintendo Switch",
      "Nintendo Switch Lite",
      "Steam Deck OLED",
      "Steam Deck",
    ],
    issues: [
      { label: "HDMI port repair",    icon: "Monitor" },
      { label: "Disc drive repair",   icon: "Disc3" },
      { label: "Controller repair",   icon: "Gamepad2" },
      { label: "Overheating / fan",   icon: "Thermometer" },
      { label: "Power issues",        icon: "PlugZap" },
      { label: "Stick drift",         icon: "Move" },
      { label: "Storage upgrade",     icon: "HardDrive" },
      { label: "Water damage",        icon: "Droplets" },
    ],
    faqs: [
      { q: "What gaming consoles do you repair?", a: "We repair PlayStation 4 & 5, Xbox One, Xbox Series X/S, Nintendo Switch (all models), and Steam Deck. Bring it in for a free diagnostic and we'll tell you exactly what's wrong and how much it costs to fix." },
      { q: "Can you fix stick drift on a controller?", a: "Yes! Stick drift is one of our most common gaming repairs. We replace the analog sticks on PS5 DualSense, Xbox controllers, and Nintendo Switch Joy-Cons, usually the same day." },
      { q: "My PS5 keeps overheating — can you fix that?", a: "Absolutely. Overheating is usually caused by dust buildup or a failing fan. Our technicians will deep clean the console, replace thermal paste, and test the fan to get your PS5 running cool again." },
    ],
  },

  /* ── Something else ── */
  "something-else": {
    slug: "something-else",
    name: "Other Device",
    tagline: "If it has a power button, we can fix it",
    description:
      "Smartwatch, drone, camera, or any other device — our technicians are skilled at diagnosing and repairing a wide variety of electronics. Bring it in for a free diagnostic.",
    heroImage: "/tech-repair/somethong.png",
    models: [
      "Apple Watch Series 10",
      "Apple Watch Ultra 2",
      "Samsung Galaxy Watch 7",
      "Fitbit / Garmin",
      "Drone (DJI, Autel, etc.)",
      "Digital Camera",
      "Action Camera (GoPro)",
      "Smart Home Devices",
      "Wireless Headphones / Earbuds",
      "Bluetooth Speakers",
      "eReader (Kindle, Kobo)",
      "Portable Gaming (Game Boy, PSP)",
    ],
    issues: [
      { label: "Screen repair",       icon: "Monitor" },
      { label: "Battery replacement", icon: "Battery" },
      { label: "Charging port",       icon: "PlugZap" },
      { label: "Water damage",        icon: "Droplets" },
      { label: "Speaker / audio",     icon: "Volume2" },
      { label: "Camera repair",       icon: "Camera" },
      { label: "Button repair",       icon: "SlidersHorizontal" },
      { label: "General diagnostics", icon: "Wrench" },
    ],
    faqs: [
      { q: "What other devices do you repair?", a: "If it has a power button, there's a good chance we can fix it. We commonly repair smartwatches, drones, cameras, earbuds, eReaders, and portable gaming devices. Bring it in for a free diagnostic — no obligation." },
      { q: "How do I know if my device is worth repairing?", a: "We always run a free diagnostic first and give you a transparent quote. If the cost of repair is too high relative to the device's value, we'll tell you honestly. We never push unnecessary repairs." },
      { q: "Do you offer a warranty on other device repairs?", a: "Yes. All repairs — regardless of device type — come with our 1-year Jesup limited warranty. If the same issue returns within a year, we fix it at no charge." },
    ],
  },
};
