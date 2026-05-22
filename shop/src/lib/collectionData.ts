const cdn = (filename: string) => `/products/${filename}`;

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  colors: string[];
  image: string;
  badge?: "New" | "Sale" | "Best Seller" | "Top Rated" | "Limited";
  inStock: boolean;
  slug: string;
  // enriched from backend
  description?: string;
  specifications?: { key: string; value: string }[];
  variantImages?: string[];
}

export interface CollectionInfo {
  title: string;
  description: string;
  accent: string;
  products: Product[];
}

export const COLLECTIONS: Record<string, CollectionInfo> = {

  // ── Audio ──────────────────────────────────────────────────────────────────
  audio: {
    title: "Audio",
    description: "Premium sound for every lifestyle — earbuds, over-ear, gaming, and more.",
    accent: "from-violet-600 to-purple-700",
    products: [
      { id: "a1", name: "Oladance OWS 2 Wearable Stereo True Wireless In Ear Headphones", brand: "Oladance", price: 149.00, rating: 4.7, reviews: 312, colors: ["Blue", "Orange", "Silver", "White"], image: cdn("EBOLA06XBUEN02.png"), badge: "New", inStock: true, slug: "oladance-ows-2-wearable-stereo-true-wireless-in-ear-headphones" },
      { id: "a2", name: "Oladance OWS Pro True Wireless In Ear Headphones", brand: "Oladance", price: 229.00, rating: 4.8, reviews: 187, colors: ["White", "Green", "Black", "Silver"], image: cdn("EBOLA07XPDEN01.png"), badge: "Top Rated", inStock: true, slug: "oladance-ows-pro-true-wireless-in-ear-headphones" },
      { id: "a3", name: "JBL Endurance Peak 3 True Wireless Waterproof Sports Earphones", brand: "JBL", price: 79.95, rating: 4.6, reviews: 891, colors: ["Black", "White"], image: cdn("JBLENDURPEAK3BLKAM.png"), inStock: true, slug: "jbl-endurance-peak-3-true-wireless-waterproof-in-ear-headphones" },
      { id: "a4", name: "JLAB GO Air POP True Wireless In Ear Earbuds", brand: "JLAB", price: 26.99, rating: 4.4, reviews: 2341, colors: ["Black", "Gray"], image: cdn("EBGAIRPOPRBLK124.png"), badge: "Best Seller", inStock: true, slug: "jlab-go-air-pop-true-wireless-in-ear-earbuds" },
      { id: "a5", name: "JBL Vibe Beam 2 True Wireless Noise Cancelling Earbuds", brand: "JBL", price: 64.95, rating: 4.5, reviews: 1203, colors: ["White", "Black"], image: cdn("JBLVBEAM2WHTAM.png"), inStock: true, slug: "jbl-vibe-beam-2-true-wireless-earbuds" },
      { id: "a6", name: "JBL Tune 310C Wired USB-C Hi-Res In-Ear Headphones", brand: "JBL", price: 24.95, rating: 4.3, reviews: 654, colors: ["White", "Black"], image: cdn("JBLT310CWHTAM.png"), inStock: true, slug: "jbl-tune-310c-wired-in-ear-headphones" },
      { id: "a7", name: "JBL Flip 7 Portable Waterproof And Drop-Proof Speaker", brand: "JBL", price: 119.95, rating: 4.8, reviews: 3201, colors: ["Black", "Blue", "Purple", "Red", "White"], image: cdn("JBLFLIP7BLKAM.png"), badge: "Best Seller", inStock: true, slug: "harman-kardon-flip-7-waterproof-bluetooth-speaker" },
      { id: "a8", name: "JBL Clip 5 Ultra-portable Waterproof Bluetooth Speaker", brand: "JBL", price: 59.95, rating: 4.7, reviews: 1567, colors: ["Black", "Blue", "Purple", "Red", "Brown", "White"], image: cdn("JBLCLIP5BLKAM.png"), inStock: true, slug: "jbl-clip-5-waterproof-bluetooth-speaker" },
      { id: "a9", name: "JBL Charge 6 Waterproof Bluetooth Speaker", brand: "JBL", price: 159.95, originalPrice: 199.95, rating: 4.8, reviews: 987, colors: ["Black", "Blue", "Red", "White", "Purple"], image: cdn("JBLCHARGE6BLKAM.png"), badge: "Sale", inStock: true, slug: "jbl-charge-6-waterproof-bluetooth-speaker" },
      { id: "a10", name: "JBL Tune 520BT Wireless On-Ear Headphones", brand: "JBL", price: 39.95, rating: 4.5, reviews: 2100, colors: ["Black", "White", "Blue", "Purple"], image: cdn("JBLT520BTBLKAM.png"), inStock: true, slug: "jbl-tune-520bt-bluetooth-on-ear-headphones" },
      { id: "a11", name: "JBL Quantum 100M2 Wired Over-Ear Gaming Headset", brand: "JBL", price: 29.95, rating: 4.4, reviews: 743, colors: ["Black", "White"], image: cdn("JBLQTUM100M2BLKAM.png"), inStock: true, slug: "jbl-quantum-100m2-wired-over-ear-gaming-headset" },
      { id: "a12", name: "JBL Tune Buds 2 True Wireless Noise Cancelling Earbuds", brand: "JBL", price: 59.95, rating: 4.6, reviews: 876, colors: ["Black", "White", "Green"], image: cdn("JBLTBUDS2BLKAM.png"), badge: "New", inStock: true, slug: "jbl-tune-buds-2-true-wireless-noise-cancelling-earbuds" },
      { id: "a13", name: "JBL Vibe Buds 2 True Wireless Noise Cancelling Earbuds", brand: "JBL", price: 64.95, rating: 4.5, reviews: 543, colors: ["Black", "White"], image: cdn("JBLVBUDS2BLKAM.png"), inStock: true, slug: "jbl-vibe-buds-2-true-wireless-earbuds" },
      { id: "a14", name: "JBL Endurance Race 2 Waterproof Sports True Wireless Earbuds", brand: "JBL", price: 89.95, rating: 4.6, reviews: 432, colors: ["Black", "Blue", "White"], image: cdn("JBLENDURACE2BLKAM.png"), inStock: true, slug: "jbl-endurance-race-2-true-wireless-active-earbuds" },
      { id: "a15", name: "JBL Junior 470NC Wireless Over-Ear Noise Cancelling Kids Headphones", brand: "JBL", price: 64.95, rating: 4.7, reviews: 321, colors: ["White"], image: cdn("JBLJR470NCWHTAM.png"), inStock: true, slug: "jbl-junior-470nc-wireless-over-ear-noise-cancelling-kids-headphones-white" },
      { id: "a16", name: "JBL Jr Junior 320 Wired On-Ear Kids Headphones", brand: "JBL", price: 19.95, rating: 4.3, reviews: 1230, colors: ["Purple", "Blue"], image: cdn("JBLJR320PURAM.png"), inStock: true, slug: "jbl-jr-320-youth-on-ear-wired-headphones" },
    ],
  },

  // ── Cases ──────────────────────────────────────────────────────────────────
  cases: {
    title: "Cases",
    description: "Every style, every device — slim, rugged, wallet, and MagSafe-ready.",
    accent: "from-rose-500 to-pink-600",
    products: [
      { id: "c1", name: "Defender Pro MagSafe Case with Camera Control for iPhone 17 Pro Max", brand: "OtterBox", price: 79.99, rating: 4.8, reviews: 543, colors: ["Black", "Blue", "Brown", "Green"], image: cdn("77-98429.png"), badge: "New", inStock: true, slug: "defender-pro-magsafe-case-with-camera-control-3" },
      { id: "c2", name: "Commuter MagSafe Case with Camera Control for iPhone 17", brand: "OtterBox", price: 49.99, rating: 4.7, reviews: 432, colors: ["Black", "Brown", "Green", "Gray", "Blue"], image: cdn("77-98294.png"), badge: "New", inStock: true, slug: "commuter-magsafe-case-with-camera-control-for-apple-iphone-17" },
      { id: "c3", name: "Civilian MagSafe Case for Apple iPhone 17 Pro Max", brand: "UAG", price: 59.95, rating: 4.7, reviews: 234, colors: ["Black", "Green"], image: cdn("114546114040.png"), badge: "New", inStock: true, slug: "civilian-lt-magsafe-case" },
      { id: "c4", name: "Urban Armor Gear Monarch Pro Case for Samsung Galaxy S25 Ultra", brand: "UAG", price: 84.95, rating: 4.8, reviews: 187, colors: ["Silver", "Gray", "Red", "Black"], image: cdn("214461113636.png"), badge: "Top Rated", inStock: true, slug: "urban-armor-gear-monarch-pro-case-for-samsung-galaxy-s-2025-large" },
      { id: "c5", name: "OtterBox Defender Case for Samsung Galaxy S24 Ultra", brand: "OtterBox", price: 69.99, rating: 4.7, reviews: 876, colors: ["Black"], image: cdn("77-94492.png"), inStock: true, slug: "otterbox-defender-case-for-samsung-galaxy-s24-ultra" },
      { id: "c6", name: "OtterBox Defender Pro Case for Samsung Galaxy S24", brand: "OtterBox", price: 69.99, rating: 4.6, reviews: 654, colors: ["Black"], image: cdn("77-94620.png"), inStock: true, slug: "otterbox-defender-pro-case-for-samsung-galaxy-s24" },
      { id: "c7", name: "OtterBox Symmetry Plus MagSafe Case for Apple iPhone 15 Pro", brand: "OtterBox", price: 59.99, rating: 4.6, reviews: 1203, colors: ["Black", "Blue"], image: cdn("77-92833.png"), badge: "Best Seller", inStock: true, slug: "otterbox-symmetry-plus-magsafe-case-for-apple-iphone-15-pro" },
      { id: "c8", name: "OtterBox Defender Case for Apple iPhone 15 / 14 / 13", brand: "OtterBox", price: 79.99, rating: 4.8, reviews: 2341, colors: ["Black"], image: cdn("77-92554.png"), badge: "Best Seller", inStock: true, slug: "otterbox-defender-case-for-apple-iphone-15-iphone-14-iphone-13" },
      { id: "c9", name: "OtterBox Defender Pro Case for Samsung Galaxy S24 FE", brand: "OtterBox", price: 69.99, rating: 4.5, reviews: 432, colors: ["Black", "Purple"], image: cdn("77-97323.png"), inStock: true, slug: "otterbox-defender-pro-case-for-samsung-galaxy-fe-2024" },
      { id: "c10", name: "OtterBox Commuter Lite Case for Samsung Galaxy A16 5G", brand: "OtterBox", price: 34.99, rating: 4.4, reviews: 321, colors: ["Purple", "Black"], image: cdn("77-97656.png"), inStock: true, slug: "otterbox-commuter-lite-case-for-samsung-galaxy-a16-5g" },
      { id: "c11", name: "OtterBox Commuter Lite Case for Samsung Galaxy A15 5G", brand: "OtterBox", price: 29.95, rating: 4.4, reviews: 287, colors: ["Black", "Multi-Color"], image: cdn("77-95183.png"), inStock: true, slug: "otterbox-commuter-lite-case-for-samsung-galaxy-a15-5g" },
      { id: "c12", name: "AMPD Military Drop Case for Motorola Moto G Stylus (2022)", brand: "AMPD", price: 17.99, rating: 4.3, reviews: 156, colors: ["Black", "Pink"], image: cdn("AA-GSTYLUS22-MILITARY-BLK.png"), inStock: true, slug: "ampd-military-drop-case-for-motorola-moto-g-stylus-2022-moto-g-stylus-5g-2022" },
      { id: "c13", name: "ITSkins Spectrum_R Clear Case for Motorola Moto G Stylus 5G (2025)", brand: "ITSkins", price: 24.99, rating: 4.3, reviews: 98, colors: ["Purple", "Black", "Clear"], image: cdn("77-95183.png"), inStock: true, slug: "itskins-spectrum-r-clear-case-for-motorola-moto-g-stylus-5g-2025" },
      { id: "c14", name: "AMPD TPU / Acrylic Hard Shell Case for Motorola Moto G Stylus (2022)", brand: "AMPD", price: 14.99, rating: 4.2, reviews: 134, colors: ["Clear"], image: cdn("AA-GSTYLUS22-TPUACRYLIC-CLR.png"), inStock: true, slug: "ampd-tpu-acrylic-hard-shell-case-for-motorola-moto-g-stylus-2022-moto-g-stylus-5g-2022-clear" },
      { id: "c15", name: "OtterBox Commuter Case for Apple iPhone 8 / 7", brand: "OtterBox", price: 39.95, rating: 4.5, reviews: 3201, colors: ["Black"], image: cdn("77-56650.png"), inStock: true, slug: "otterbox-commuter-case-for-apple-iphone-se-2022-se-2020-8-7" },
      { id: "c16", name: "Case-Mate Tough Case for Motorola Edge (2021)", brand: "Case-Mate", price: 40.00, rating: 4.4, reviews: 212, colors: ["Clear", "Black"], image: cdn("CM046030.png"), inStock: true, slug: "case-mate-tough-case-for-motorola-edge-2021-edge-5g-uw" },
    ],
  },

  // ── Screen Protection ──────────────────────────────────────────────────────
  "screen-protection": {
    title: "Screen Protection",
    description: "Tempered glass and film protectors for every screen size.",
    accent: "from-cyan-500 to-blue-600",
    products: [
      { id: "sp1", name: "ZAGG Privacy XTR Tempered Glass for Apple iPhone 17 Pro Max", brand: "ZAGG", price: 59.99, rating: 4.7, reviews: 543, colors: ["Clear"], image: cdn("200118666.png"), badge: "New", inStock: true, slug: "privacy-xtr-tempered-glass-screen-protector-for-apple-2025-iphone-6-9-pro-max" },
      { id: "sp2", name: "ZAGG Glass Screen Protector for Apple iPhone 17 Pro", brand: "ZAGG", price: 34.99, rating: 4.7, reviews: 432, colors: ["Clear"], image: cdn("200118721.png"), badge: "New", inStock: true, slug: "zagg-glass-screen-protector-for-apple-iphone-17-pro-clear" },
      { id: "sp3", name: "ZAGG Glass Screen Protector for Apple iPhone 17 Pro Max", brand: "ZAGG", price: 34.99, rating: 4.7, reviews: 387, colors: ["Clear"], image: cdn("200118722.png"), badge: "New", inStock: true, slug: "glass-screen-protector-for-apple-iphone-17-pro-max-1" },
      { id: "sp4", name: "OtterBox Glass Screen Protector for Apple iPhone 17", brand: "OtterBox", price: 39.99, rating: 4.6, reviews: 234, colors: ["Clear"], image: cdn("77-98674.png"), badge: "New", inStock: true, slug: "glass-screen-protector-for-apple-iphone-17" },
      { id: "sp5", name: "OtterBox Glass Screen Protector for Apple iPhone 17 Pro", brand: "OtterBox", price: 39.99, rating: 4.6, reviews: 198, colors: ["Clear"], image: cdn("77-98682.png"), badge: "New", inStock: true, slug: "glass-screen-protector-for-apple-iphone-17-pro-1" },
      { id: "sp6", name: "OtterBox Glass Screen Protector for Apple iPhone 17 Pro Max", brand: "OtterBox", price: 39.99, rating: 4.6, reviews: 176, colors: ["Clear"], image: cdn("77-98686.png"), badge: "New", inStock: true, slug: "otterbox-glass-screen-protector-for-apple-iphone-17-pro-max-clear" },
      { id: "sp7", name: "OtterBox Premium Glass Screen Protector for Samsung Galaxy S25", brand: "OtterBox", price: 49.99, rating: 4.7, reviews: 543, colors: ["Clear"], image: cdn("77-97840.png"), badge: "Best Seller", inStock: true, slug: "otterbox-premium-glass-screen-protector-for-samsung-galaxy-s-2025-small-clear" },
      { id: "sp8", name: "Gadget Guard Plus 4 Way Privacy Glass for Samsung Galaxy S25 Ultra", brand: "Gadget Guard", price: 59.99, rating: 4.6, reviews: 321, colors: ["Clear"], image: cdn("VTGLP1F211SS03A.png"), inStock: true, slug: "gadget-guard-plus-4-way-privacy-150-guarantee-glass-screen-protector-for-samsung-galaxy-s-2025-large-clear" },
      { id: "sp9", name: "Gadget Guard Liquid Screen Protection Clear", brand: "Gadget Guard", price: 24.99, rating: 4.5, reviews: 1234, colors: ["Clear"], image: cdn("GGBILEC208GG01A.png"), badge: "Best Seller", inStock: true, slug: "gadget-guard-liquid-screen-protection-clear" },
      { id: "sp10", name: "Gadget Guard Plus Liquid Screen Protection $150 Clear", brand: "Gadget Guard", price: 44.99, rating: 4.6, reviews: 876, colors: ["Clear"], image: cdn("VTBILPC208GG21V.png"), inStock: true, slug: "gadget-guard-plus-liquid-screen-protection-150-clear" },
      { id: "sp11", name: "Gadget Guard Ultrashock Screen Protector for Apple Watch Series 10", brand: "Gadget Guard", price: 29.99, rating: 4.5, reviews: 432, colors: ["Clear"], image: cdn("VG-GGFLEXW215AP04A.png"), inStock: true, slug: "gadget-guard-ultrashock-screen-protector-for-apple-awsx45-clear" },
      { id: "sp12", name: "OtterBox Premium Glass for Apple iPhone 15 / 14 / 13", brand: "OtterBox", price: 49.99, rating: 4.7, reviews: 2341, colors: ["Clear"], image: cdn("77-96635.png"), badge: "Top Rated", inStock: true, slug: "otterbox-premium-glass-screen-protector-for-apple-iphone-15-iphone-14-iphone-13-iphone-16e-clear" },
      { id: "sp13", name: "Simple $200 Guided Tempered Glass for Samsung Galaxy S25", brand: "Simple", price: 39.99, rating: 4.5, reviews: 654, colors: ["Clear"], image: cdn("581641.png"), inStock: true, slug: "simple-200-guided-tempered-glass-for-samsung-galaxy-s-2025-small-clear" },
      { id: "sp14", name: "AMPD 0.33 Hardened Tempered Glass for Boost Celero 5G (Gen 3)", brand: "AMPD", price: 17.99, rating: 4.3, reviews: 187, colors: ["Clear"], image: cdn("AA-CELERO3-33SINGLE.png"), inStock: true, slug: "ampd-0-33-hardened-tempered-glass-screen-protector-for-boost-celero-5g-gen-3-clear" },
      { id: "sp15", name: "Gadget Guard Glass Screen Protector for Apple iPad Air 11", brand: "Gadget Guard", price: 69.99, rating: 4.6, reviews: 321, colors: ["Clear"], image: cdn("GGGLAST340AP04A.png"), inStock: true, slug: "gadget-guard-glass-screen-protector-for-apple-ipad-air-11-clear" },
      { id: "sp16", name: "OtterBox Glass Screen Protector for Samsung Galaxy A15 5G", brand: "OtterBox", price: 29.95, rating: 4.5, reviews: 432, colors: ["Clear"], image: cdn("77-95031.png"), inStock: true, slug: "otterbox-glass-screen-protector-for-samsung-galaxy-a15-5g-clear" },
    ],
  },

  // ── Power ──────────────────────────────────────────────────────────────────
  power: {
    title: "Power",
    description: "Stay charged anywhere — cables, power banks, wireless pads, and car chargers.",
    accent: "from-yellow-400 to-orange-500",
    products: [
      { id: "pw1", name: "Anker PowerCore 326 2 Port Power Bank 20W 20,000 mAh", brand: "Anker", price: 49.99, rating: 4.7, reviews: 2341, colors: ["Black"], image: cdn("A1367H11-1.png"), badge: "Best Seller", inStock: true, slug: "anker-powercore-326-2-port-power-bank-20w-20-000-mah-black" },
      { id: "pw2", name: "Anker Prime Power Bank 9,600 mAh with USB-C Cable 65W", brand: "Anker", price: 109.99, rating: 4.8, reviews: 1234, colors: ["Black"], image: cdn("A1339111-1.png"), badge: "Top Rated", inStock: true, slug: "anker-prime-power-bank-9-600-mah-with-built-in-usb-c-cable-and-fusion-wall-charger-65w-black" },
      { id: "pw3", name: "mophie PowerStation Plus 2024 AC Power Bank 10,000 mAh", brand: "mophie", price: 99.95, rating: 4.6, reviews: 876, colors: ["Black"], image: cdn("401114329.png"), inStock: true, slug: "mophie-powerstation-plus-2024-ac-power-bank-10-000-mah-black-51" },
      { id: "pw4", name: "mophie Snap Plus MagSafe Powerstation Wireless Stand 10,000 mAh", brand: "mophie", price: 69.95, rating: 4.7, reviews: 654, colors: ["Black"], image: cdn("401107913.png"), badge: "New", inStock: true, slug: "mophie-snap-plus-magsafe-powerstation-wireless-charging-stand-power-bank-10-000-mah-black" },
      { id: "pw5", name: "Jesup Portable Magnetic Battery 5,000 mAh", brand: "Jesup", price: 49.99, rating: 4.5, reviews: 432, colors: ["Gray"], image: cdn("MCBAT-ASR5K175252.png"), inStock: true, slug: "ventev-portable-magnetic-battery-5-000-mah" },
      { id: "pw6", name: "Ventev 30W ULTRAFAST USB-C Mini GaN Wall Charger + Cable", brand: "Ventev", price: 39.99, rating: 4.6, reviews: 543, colors: ["White"], image: cdn("WC30-CCBX-87438.png"), inStock: true, slug: "ventev-30w-ultrafast-usb-c-mini-gan-wall-charger-and-usb-c-to-usb-c-cable-white" },
      { id: "pw7", name: "Cellhelmet PD USB C Wall Charger 30W", brand: "Cellhelmet", price: 34.99, rating: 4.5, reviews: 321, colors: ["White"], image: cdn("WALL-PD-30W-W.png"), inStock: true, slug: "cellhelmet-pd-usb-c-wall-charger-30w-white" },
      { id: "pw8", name: "OtterBox Premium Pro USB C Car Charger 30W", brand: "OtterBox", price: 29.95, rating: 4.6, reviews: 765, colors: ["Black"], image: cdn("78-80892.png"), inStock: true, slug: "otterbox-premium-pro-usb-c-car-charger-30w-black" },
      { id: "pw9", name: "OtterBox Premium Pro USB C to USB C Car Charging Kit 30W", brand: "OtterBox", price: 39.95, rating: 4.6, reviews: 543, colors: ["Black"], image: cdn("78-80893.png"), inStock: true, slug: "otterbox-premium-pro-usb-c-to-usb-c-car-charging-kit-30w-black" },
      { id: "pw10", name: "Ventev 10W Wireless Chargepad", brand: "Ventev", price: 34.99, rating: 4.4, reviews: 432, colors: ["White"], image: cdn("WLS10-ASR266583.png"), inStock: true, slug: "ventev-10w-wireless-chargepad" },
      { id: "pw11", name: "Ventev Helix USB-A to USB-C High Speed Travel 3ft Cable", brand: "Ventev", price: 24.99, rating: 4.5, reviews: 876, colors: ["Gray"], image: cdn("COILCABACVNV.png"), inStock: true, slug: "ventev-helix-usb-a-to-usb-c-high-speed-travel-cable-gray" },
      { id: "pw12", name: "mophie USB C to USB C Cable 6ft", brand: "mophie", price: 24.95, rating: 4.4, reviews: 654, colors: ["Black"], image: cdn("409911482.png"), inStock: true, slug: "mophie-usb-c-to-usb-c-cable-6ft-black" },
      { id: "pw13", name: "Belkin BoostCharge Dual USB-A Wall Charger 24W", brand: "Belkin", price: 24.99, rating: 4.5, reviews: 1234, colors: ["White"], image: cdn("WCB002DQWH.png"), badge: "Best Seller", inStock: true, slug: "belkin-dual-port-usb-a-24w-wall-charger-white" },
      { id: "pw14", name: "Belkin BoostCharge Dual Port USB-A and USB-C PD 37W Charger", brand: "Belkin", price: 30.99, rating: 4.5, reviews: 987, colors: ["White"], image: cdn("WCB007DQWH.png"), inStock: true, slug: "belkin-dual-port-usb-a-and-usb-c-pd-37w-wall-charger-with-pps-white" },
      { id: "pw15", name: "Ventev 10W Essentials Dash 121c Car Charger with Micro USB", brand: "Ventev", price: 19.99, rating: 4.3, reviews: 432, colors: ["White"], image: cdn("DP121CMCRFW18VNV.png"), inStock: true, slug: "ventev-10w-dash-121c-car-charger-for-micro-usb-devices-white" },
      { id: "pw16", name: "Ventev 24W ULTRAFAST USB-A Car Charger and Micro-USB Cable", brand: "Ventev", price: 34.99, rating: 4.4, reviews: 321, colors: ["Gray"], image: cdn("RQ1300VPAVNV.png"), inStock: true, slug: "ventev-qc3-0-24w-dashport-rq1300-mini-car-charger-and-usb-a-to-micro-usb-cable-3-3ft-gray" },
    ],
  },

  // ── Accessories ────────────────────────────────────────────────────────────
  accessories: {
    title: "Accessories",
    description: "Grips, mounts, organizers, gaming gear, and every everyday essential.",
    accent: "from-emerald-500 to-teal-600",
    products: [
      { id: "ac1", name: "PopSockets PopWallet Black", brand: "PopSockets", price: 19.99, rating: 4.6, reviews: 3201, colors: ["Black"], image: cdn("800859.png"), badge: "Best Seller", inStock: true, slug: "popsockets-popwallet-black" },
      { id: "ac2", name: "PopSockets PopWallet Plus with PopGrip", brand: "PopSockets", price: 24.99, rating: 4.6, reviews: 2341, colors: ["Pink", "Black"], image: cdn("801938.png"), inStock: true, slug: "popsockets-popwallet-plus-with-popgrip" },
      { id: "ac3", name: "PopSockets MagSafe PopGrip Orange", brand: "PopSockets", price: 29.99, rating: 4.5, reviews: 1234, colors: ["Orange"], image: cdn("800859.png"), badge: "New", inStock: true, slug: "popsockets-magsafe-popgrip-orange" },
      { id: "ac4", name: "PopSockets PopWallet for MagSafe Devices", brand: "PopSockets", price: 34.99, rating: 4.6, reviews: 987, colors: ["Black"], image: cdn("801938.png"), inStock: true, slug: "popsockets-popwallet-for-magsafe-devices" },
      { id: "ac5", name: "Kate Spade Morgan Magnetic Wallet", brand: "Kate Spade", price: 49.99, rating: 4.7, reviews: 654, colors: ["Black", "Pink", "Silver"], image: cdn("KS053956.png"), badge: "Top Rated", inStock: true, slug: "kate-spade-morgan-magnetic-wallet" },
      { id: "ac6", name: "Nite Ize Steelie Orbiter Dash Mount Kit Black", brand: "Nite Ize", price: 39.99, rating: 4.5, reviews: 543, colors: ["Black"], image: cdn("STODK-01-R8.jpg"), inStock: true, slug: "nite-ize-steelie-orbiter-dash-mount-kit-black" },
      { id: "ac7", name: "Nite Ize Steelie Orbiter Plus Dash Mount for MagSafe", brand: "Nite Ize", price: 54.99, rating: 4.6, reviews: 432, colors: ["Black"], image: cdn("STODK-01-R8.jpg"), badge: "New", inStock: true, slug: "nite-ize-steelie-orbiter-plus-dash-mount-kit-for-magsafe-black" },
      { id: "ac8", name: "OtterBox Car Dash / Window Mount for MagSafe Black", brand: "OtterBox", price: 49.95, rating: 4.7, reviews: 765, colors: ["Black"], image: cdn("78-80446.png"), inStock: true, slug: "otterbox-car-dash-window-mount-for-magsafe-black" },
      { id: "ac9", name: "OhSnap! Snap 4 Luxe Phone Grip", brand: "OhSnap", price: 39.99, rating: 4.4, reviews: 321, colors: ["Black", "Silver"], image: cdn("78-80446.png"), inStock: true, slug: "ohsnap-snap-4-luxe-phone-grip" },
    ],
  },

  // ── Deals ──────────────────────────────────────────────────────────────────
  deals: {
    title: "Deals & More",
    description: "Hand-picked bundles and value sets curated by our repair experts.",
    accent: "from-amber-500 to-orange-500",
    products: [
      { id: "d1", name: "JLAB GO Air POP True Wireless In Ear Earbuds", brand: "JLAB", price: 26.99, rating: 4.4, reviews: 2341, colors: ["Black", "Gray"], image: cdn("EBGAIRPOPRBLK124.png"), badge: "Best Seller", inStock: true, slug: "jlab-go-air-pop-true-wireless-in-ear-earbuds" },
      { id: "d2", name: "JBL Tune 520BT Wireless On-Ear Headphones", brand: "JBL", price: 39.95, rating: 4.5, reviews: 2100, colors: ["Black", "Blue"], image: cdn("JBLT520BTBLKAM.png"), inStock: true, slug: "jbl-tune-520bt-bluetooth-on-ear-headphones" },
      { id: "d3", name: "AMPD Military Drop Case for Motorola Moto G Stylus (2022)", brand: "AMPD", price: 17.99, rating: 4.3, reviews: 156, colors: ["Black", "Pink"], image: cdn("AA-GSTYLUS22-MILITARY-BLK.png"), badge: "Sale", inStock: true, slug: "ampd-military-drop-case-for-motorola-moto-g-stylus-2022-moto-g-stylus-5g-2022" },
      { id: "d4", name: "Gadget Guard Liquid Screen Protection Clear", brand: "Gadget Guard", price: 24.99, rating: 4.5, reviews: 1234, colors: ["Clear"], image: cdn("GGBILEC208GG01A.png"), inStock: true, slug: "gadget-guard-liquid-screen-protection-clear" },
      { id: "d5", name: "Ventev 30W ULTRAFAST USB-C Mini GaN Wall Charger + Cable", brand: "Ventev", price: 39.99, rating: 4.6, reviews: 543, colors: ["White"], image: cdn("WC30-CCBX-87438.png"), inStock: true, slug: "ventev-30w-ultrafast-usb-c-mini-gan-wall-charger-and-usb-c-to-usb-c-cable-white" },
      { id: "d6", name: "PopSockets PopWallet Black", brand: "PopSockets", price: 19.99, rating: 4.6, reviews: 3201, colors: ["Black"], image: cdn("800859.png"), badge: "Sale", inStock: true, slug: "popsockets-popwallet-black" },
      { id: "d7", name: "Anker PowerCore 326 Power Bank 20,000 mAh", brand: "Anker", price: 49.99, rating: 4.7, reviews: 2341, colors: ["Black"], image: cdn("A1367H11-1.png"), badge: "Best Seller", inStock: true, slug: "anker-powercore-326-2-port-power-bank-20w-20-000-mah-black" },
      { id: "d8", name: "JBL Jr Junior 320 Wired On-Ear Kids Headphones", brand: "JBL", price: 19.95, rating: 4.3, reviews: 1230, colors: ["Purple", "Blue"], image: cdn("JBLJR320PURAM.png"), inStock: true, slug: "jbl-jr-320-youth-on-ear-wired-headphones" },
      { id: "d9", name: "Belkin BoostCharge Dual USB-A Wall Charger 24W", brand: "Belkin", price: 24.99, rating: 4.5, reviews: 1234, colors: ["White"], image: cdn("WCB002DQWH.png"), inStock: true, slug: "belkin-dual-port-usb-a-24w-wall-charger-white" },
      { id: "d10", name: "AMPD 0.33 Hardened Tempered Glass Screen Protector", brand: "AMPD", price: 17.99, rating: 4.3, reviews: 187, colors: ["Clear"], image: cdn("AA-CELERO3-33SINGLE.png"), badge: "Sale", inStock: true, slug: "ampd-0-33-hardened-tempered-glass-screen-protector-for-boost-celero-5g-gen-3-clear" },
    ],
  },
};

export const COLOR_HEX: Record<string, string> = {
  Black: "#111827",
  White: "#F9FAFB",
  Navy: "#1e3a5f",
  Gray: "#9CA3AF",
  Silver: "#D1D5DB",
  Blue: "#3B82F6",
  Red: "#EF4444",
  Pink: "#EC4899",
  Green: "#22C55E",
  Purple: "#A855F7",
  Clear: "transparent",
  "Multi-Color": "linear-gradient(135deg,#f00 0%,#0f0 50%,#00f 100%)",
  Graphite: "#374151",
  Cream: "#FEF3C7",
  Sand: "#D4A96A",
  Midnight: "#1C1C1E",
  Starlight: "#F5F0E8",
  Teal: "#14B8A6",
  Orange: "#F97316",
  Brown: "#92400E",
};

// Find a product + its collection by slug
export function findProduct(slug: string): { product: Product; collectionId: string } | null {
  for (const [id, col] of Object.entries(COLLECTIONS)) {
    const product = col.products.find((p) => p.slug === slug);
    if (product) return { product, collectionId: id };
  }
  return null;
}

// All slugs (for generateStaticParams)
export function allProductSlugs(): string[] {
  return Object.values(COLLECTIONS).flatMap((col) => col.products.map((p) => p.slug));
}
