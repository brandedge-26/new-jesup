// ── Types ─────────────────────────────────────────────────────────────────────

export type OrderStatus    = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type ProductStatus  = "Active" | "Draft" | "Out of Stock";
export type CustomerStatus = "Active" | "Inactive";
export type RepairStatus   = "Pending" | "Diagnosing" | "In Repair" | "Ready" | "Completed" | "Cancelled";
export type AppStatus      = "New" | "Reviewed" | "Quoted" | "Rejected";

export interface RepairBooking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  device: string;
  brand: string;
  model: string;
  issue: string;
  delivery: "Drop-off" | "Mail-in";
  dateBooked: string;
  scheduledDate: string;
  status: RepairStatus;
  estimate: number;
  technician: string;
}

export interface RepairApplication {
  id: string;
  customer: string;
  email: string;
  phone: string;
  device: string;
  brand: string;
  model: string;
  issue: string;
  description: string;
  submittedAt: string;
  status: AppStatus;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  status: OrderStatus;
  items: number;
  total: number;
  payment: string;
  product: string;
}

export interface VariantOption {
  label: string;
}

export interface Variant {
  name: string;
  options: VariantOption[];
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  revenue: number;
  sku: string;
  brand: string;
  company: string;
  image: string;           // main image — base64 data URL
  variantImages: string[]; // up to 4 variant images — base64 data URLs
  variants: Variant[];
  specifications: Specification[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  joined: string;
  status: CustomerStatus;
  city: string;
}

// ── Mock Orders (50) ──────────────────────────────────────────────────────────

export const ORDERS: Order[] = [
  { id: "ORD-1001", customer: "James Carter",    email: "james@example.com",   date: "2025-05-14", status: "Delivered",   items: 2, total: 189.99, payment: "Visa",       product: "JBL Flip 7 Speaker" },
  { id: "ORD-1002", customer: "Sofia Reyes",     email: "sofia@example.com",   date: "2025-05-14", status: "Processing",  items: 1, total:  79.95, payment: "PayPal",     product: "OtterBox Defender Case" },
  { id: "ORD-1003", customer: "Liam Johnson",    email: "liam@example.com",    date: "2025-05-13", status: "Shipped",     items: 3, total: 249.85, payment: "Mastercard", product: "Anker Power Bank" },
  { id: "ORD-1004", customer: "Emma Williams",   email: "emma@example.com",    date: "2025-05-13", status: "Pending",     items: 1, total:  34.99, payment: "Visa",       product: "ZAGG Screen Protector" },
  { id: "ORD-1005", customer: "Noah Brown",      email: "noah@example.com",    date: "2025-05-12", status: "Delivered",   items: 2, total: 159.90, payment: "Apple Pay",  product: "Oladance OWS 2" },
  { id: "ORD-1006", customer: "Ava Martinez",    email: "ava@example.com",     date: "2025-05-12", status: "Cancelled",   items: 1, total:  59.99, payment: "Visa",       product: "UAG Civilian Case" },
  { id: "ORD-1007", customer: "Oliver Davis",    email: "oliver@example.com",  date: "2025-05-11", status: "Delivered",   items: 4, total: 312.45, payment: "PayPal",     product: "JBL Charge 6" },
  { id: "ORD-1008", customer: "Isabella Wilson", email: "isabella@example.com",date: "2025-05-11", status: "Shipped",     items: 1, total:  84.95, payment: "Mastercard", product: "UAG Monarch Pro Case" },
  { id: "ORD-1009", customer: "Elijah Taylor",   email: "elijah@example.com",  date: "2025-05-10", status: "Processing",  items: 2, total: 139.90, payment: "Visa",       product: "mophie Wireless Charger" },
  { id: "ORD-1010", customer: "Mia Anderson",    email: "mia@example.com",     date: "2025-05-10", status: "Delivered",   items: 1, total:  26.99, payment: "Apple Pay",  product: "JLAB Go Air Pop" },
  { id: "ORD-1011", customer: "Lucas Thomas",    email: "lucas@example.com",   date: "2025-05-09", status: "Shipped",     items: 2, total: 199.94, payment: "Visa",       product: "Oladance OWS Pro" },
  { id: "ORD-1012", customer: "Charlotte Garcia",email: "charlotte@example.com",date: "2025-05-09",status: "Pending",     items: 1, total:  69.99, payment: "PayPal",     product: "OtterBox Defender S24 Ultra" },
  { id: "ORD-1013", customer: "Mason Lee",       email: "mason@example.com",   date: "2025-05-08", status: "Delivered",   items: 3, total: 224.85, payment: "Mastercard", product: "Anker USB-C Hub" },
  { id: "ORD-1014", customer: "Amelia Rodriguez",email: "amelia@example.com",  date: "2025-05-08", status: "Delivered",   items: 1, total:  59.95, payment: "Visa",       product: "JBL Vibe Beam 2" },
  { id: "ORD-1015", customer: "Ethan Jackson",   email: "ethan@example.com",   date: "2025-05-07", status: "Cancelled",   items: 2, total: 109.98, payment: "PayPal",     product: "PopSockets Grip" },
  { id: "ORD-1016", customer: "Harper White",    email: "harper@example.com",  date: "2025-05-07", status: "Processing",  items: 1, total: 149.00, payment: "Visa",       product: "Oladance OWS 2" },
  { id: "ORD-1017", customer: "Aiden Harris",    email: "aiden@example.com",   date: "2025-05-06", status: "Delivered",   items: 2, total: 134.90, payment: "Apple Pay",  product: "Belkin Car Charger" },
  { id: "ORD-1018", customer: "Evelyn Martin",   email: "evelyn@example.com",  date: "2025-05-06", status: "Shipped",     items: 3, total: 279.85, payment: "Mastercard", product: "JBL Clip 5 Speaker" },
  { id: "ORD-1019", customer: "Sebastian Lewis", email: "sebastian@example.com",date: "2025-05-05",status: "Delivered",   items: 1, total:  79.99, payment: "Visa",       product: "OtterBox Commuter Case" },
  { id: "ORD-1020", customer: "Aria Lee",        email: "aria@example.com",    date: "2025-05-05", status: "Pending",     items: 2, total: 149.90, payment: "PayPal",     product: "ZAGG InvisibleShield" },
  { id: "ORD-1021", customer: "Jack Walker",     email: "jack@example.com",    date: "2025-05-04", status: "Delivered",   items: 1, total: 119.95, payment: "Visa",       product: "JBL Flip 7 Speaker" },
  { id: "ORD-1022", customer: "Scarlett Hall",   email: "scarlett@example.com",date: "2025-05-04", status: "Processing",  items: 2, total:  89.98, payment: "Apple Pay",  product: "Ventev Powercell" },
  { id: "ORD-1023", customer: "William Allen",   email: "william@example.com", date: "2025-05-03", status: "Shipped",     items: 1, total:  64.95, payment: "Mastercard", product: "JBL Tune Buds 2" },
  { id: "ORD-1024", customer: "Grace Young",     email: "grace@example.com",   date: "2025-05-03", status: "Delivered",   items: 4, total: 389.80, payment: "Visa",       product: "UAG Monarch Pro" },
  { id: "ORD-1025", customer: "Henry King",      email: "henry@example.com",   date: "2025-05-02", status: "Delivered",   items: 1, total:  29.95, payment: "PayPal",     product: "JBL Tune 310C" },
  { id: "ORD-1026", customer: "Zoey Wright",     email: "zoey@example.com",    date: "2025-05-02", status: "Cancelled",   items: 2, total: 124.90, payment: "Visa",       product: "OtterBox Symmetry" },
  { id: "ORD-1027", customer: "Jackson Scott",   email: "jackson@example.com", date: "2025-05-01", status: "Delivered",   items: 1, total:  39.95, payment: "Apple Pay",  product: "JBL Tune 520BT" },
  { id: "ORD-1028", customer: "Luna Torres",     email: "luna@example.com",    date: "2025-05-01", status: "Shipped",     items: 3, total: 234.85, payment: "Mastercard", product: "Anker Power Bank 20K" },
  { id: "ORD-1029", customer: "Logan Nguyen",    email: "logan@example.com",   date: "2025-04-30", status: "Delivered",   items: 1, total:  59.99, payment: "Visa",       product: "OtterBox Defender Pro" },
  { id: "ORD-1030", customer: "Chloe Hill",      email: "chloe@example.com",   date: "2025-04-30", status: "Processing",  items: 2, total: 179.90, payment: "PayPal",     product: "JBL Charge 6" },
  { id: "ORD-1031", customer: "Caleb Green",     email: "caleb@example.com",   date: "2025-04-29", status: "Pending",     items: 1, total:  17.99, payment: "Visa",       product: "AMPD Military Case" },
  { id: "ORD-1032", customer: "Penelope Adams",  email: "penelope@example.com",date: "2025-04-29", status: "Delivered",   items: 2, total:  89.94, payment: "Apple Pay",  product: "Kate Spade Grip" },
  { id: "ORD-1033", customer: "Ryan Baker",      email: "ryan@example.com",    date: "2025-04-28", status: "Shipped",     items: 1, total: 159.95, payment: "Mastercard", product: "JBL Charge 6" },
  { id: "ORD-1034", customer: "Nora Gonzalez",   email: "nora@example.com",    date: "2025-04-28", status: "Delivered",   items: 3, total: 264.85, payment: "Visa",       product: "mophie Powerstation" },
  { id: "ORD-1035", customer: "Dylan Nelson",    email: "dylan@example.com",   date: "2025-04-27", status: "Delivered",   items: 1, total:  49.99, payment: "PayPal",     product: "OtterBox Commuter" },
  { id: "ORD-1036", customer: "Hannah Carter",   email: "hannah@example.com",  date: "2025-04-27", status: "Cancelled",   items: 2, total:  99.90, payment: "Visa",       product: "Oladance OWS 2" },
  { id: "ORD-1037", customer: "Joshua Mitchell", email: "joshua@example.com",  date: "2025-04-26", status: "Delivered",   items: 1, total:  24.95, payment: "Apple Pay",  product: "JBL Tune 310C" },
  { id: "ORD-1038", customer: "Layla Perez",     email: "layla@example.com",   date: "2025-04-26", status: "Processing",  items: 2, total: 169.90, payment: "Mastercard", product: "Belkin MagSafe Charger" },
  { id: "ORD-1039", customer: "Andrew Roberts",  email: "andrew@example.com",  date: "2025-04-25", status: "Shipped",     items: 1, total:  84.95, payment: "Visa",       product: "UAG Monarch Pro" },
  { id: "ORD-1040", customer: "Lily Turner",     email: "lily@example.com",    date: "2025-04-25", status: "Delivered",   items: 4, total: 339.80, payment: "PayPal",     product: "JBL Flip 7 Speaker" },
  { id: "ORD-1041", customer: "Nathan Phillips",  email: "nathan@example.com",  date: "2025-04-24", status: "Delivered",   items: 1, total:  64.95, payment: "Visa",       product: "JBL Vibe Buds 2" },
  { id: "ORD-1042", customer: "Stella Campbell",  email: "stella@example.com",  date: "2025-04-24", status: "Pending",     items: 2, total:  99.98, payment: "Apple Pay",  product: "ZAGG Screen Protector" },
  { id: "ORD-1043", customer: "Isaac Parker",    email: "isaac@example.com",   date: "2025-04-23", status: "Delivered",   items: 1, total:  29.95, payment: "Mastercard", product: "JBL Jr 320 Kids" },
  { id: "ORD-1044", customer: "Violet Evans",    email: "violet@example.com",  date: "2025-04-23", status: "Shipped",     items: 3, total: 289.85, payment: "Visa",       product: "Anker USB-C Hub" },
  { id: "ORD-1045", customer: "Owen Edwards",    email: "owen@example.com",    date: "2025-04-22", status: "Delivered",   items: 1, total: 229.00, payment: "PayPal",     product: "Oladance OWS Pro" },
  { id: "ORD-1046", customer: "Ellie Collins",   email: "ellie@example.com",   date: "2025-04-22", status: "Processing",  items: 2, total: 149.90, payment: "Visa",       product: "PopSockets MagSafe" },
  { id: "ORD-1047", customer: "Leo Stewart",     email: "leo@example.com",     date: "2025-04-21", status: "Delivered",   items: 1, total:  59.95, payment: "Apple Pay",  product: "JBL Clip 5 Speaker" },
  { id: "ORD-1048", customer: "Aurora Sanchez",  email: "aurora@example.com",  date: "2025-04-21", status: "Cancelled",   items: 2, total: 129.94, payment: "Mastercard", product: "OtterBox Defender" },
  { id: "ORD-1049", customer: "Eli Morris",      email: "eli@example.com",     date: "2025-04-20", status: "Delivered",   items: 1, total:  89.95, payment: "Visa",       product: "JBL Endurance Peak 3" },
  { id: "ORD-1050", customer: "Hazel Rogers",    email: "hazel@example.com",   date: "2025-04-20", status: "Shipped",     items: 3, total: 214.85, payment: "PayPal",     product: "Belkin Wireless Stand" },
];

// ── Mock Products (20) ────────────────────────────────────────────────────────

function opts(...labels: string[]): VariantOption[] {
  return labels.map((label) => ({ label }));
}

export const PRODUCTS: Product[] = [
  {
    id: "PRD-001", name: "JBL Flip 7 Bluetooth Speaker", category: "Audio", price: 119.95, stock: 48, status: "Active", revenue: 14394.00, sku: "JBLFLIP7BLKAM",
    brand: "JBL", company: "HARMAN International", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Squad", "Blue", "Red", "Pink") }],
    specifications: [{ key: "Driver Size", value: "2 × 40mm" }, { key: "Battery Life", value: "12 hours" }, { key: "Waterproof", value: "IP67" }, { key: "Bluetooth", value: "5.3" }],
  },
  {
    id: "PRD-002", name: "OtterBox Defender Pro Case", category: "Cases", price: 79.99, stock: 102, status: "Active", revenue: 9678.79, sku: "77-98429",
    brand: "OtterBox", company: "Otter Products LLC", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Navy", "Purple") }, { name: "Model", options: opts("iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max") }],
    specifications: [{ key: "Material", value: "Polycarbonate + Silicone" }, { key: "Drop Protection", value: "4× Military Standard" }, { key: "MagSafe", value: "No" }],
  },
  {
    id: "PRD-003", name: "Anker 20K Power Bank", category: "Power", price: 49.99, stock: 76, status: "Active", revenue: 7498.50, sku: "A1268H11",
    brand: "Anker", company: "Anker Innovations", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "White") }],
    specifications: [{ key: "Capacity", value: "20,000 mAh" }, { key: "Output", value: "22.5W" }, { key: "Ports", value: "2× USB-A, 1× USB-C" }, { key: "Weight", value: "362g" }],
  },
  {
    id: "PRD-004", name: "ZAGG InvisibleShield Glass Elite", category: "Screen Protection", price: 44.99, stock: 89, status: "Active", revenue: 6298.60, sku: "ZAGG-GE-IP17",
    brand: "ZAGG", company: "ZAGG Inc.", image: "", variantImages: [],
    variants: [{ name: "Model", options: opts("iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "Galaxy S26") }],
    specifications: [{ key: "Material", value: "Tempered Glass" }, { key: "Hardness", value: "9H" }, { key: "Coating", value: "Anti-fingerprint" }],
  },
  {
    id: "PRD-005", name: "Oladance OWS 2 Wireless Earbuds", category: "Audio", price: 149.00, stock: 23, status: "Active", revenue: 11322.00, sku: "EBOLA06XBUEN02",
    brand: "Oladance", company: "Oladance Inc.", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Carbon Black", "Chalk White", "Deep Blue") }],
    specifications: [{ key: "Driver Size", value: "16.5mm" }, { key: "Battery Life", value: "16 hrs + 48 hrs case" }, { key: "Connectivity", value: "Bluetooth 5.3" }, { key: "Open-Ear", value: "Yes" }],
  },
  {
    id: "PRD-006", name: "UAG Monarch Pro Case Samsung", category: "Cases", price: 84.95, stock: 34, status: "Active", revenue: 5950.50, sku: "214461113636",
    brand: "UAG", company: "Urban Armor Gear", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Kevlar Black", "Silver") }, { name: "Model", options: opts("Galaxy S26", "Galaxy S26+", "Galaxy S26 Ultra") }],
    specifications: [{ key: "Material", value: "Alloy + Aramid" }, { key: "Drop Protection", value: "MIL-STD-810H" }, { key: "MagSafe", value: "Compatible" }],
  },
  {
    id: "PRD-007", name: "mophie Wireless Charging Stand", category: "Power", price: 59.99, stock: 57, status: "Active", revenue: 4319.28, sku: "MOPH-WS-15W",
    brand: "mophie", company: "ZAGG Inc.", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "White") }],
    specifications: [{ key: "Output", value: "15W" }, { key: "Standard", value: "Qi2 / MagSafe" }, { key: "Cable", value: "USB-C" }],
  },
  {
    id: "PRD-008", name: "JBL Charge 6 Waterproof Speaker", category: "Audio", price: 159.95, stock: 31, status: "Active", revenue: 12796.00, sku: "JBLCHARGE6BLKAM",
    brand: "JBL", company: "HARMAN International", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Blue", "Red", "Desert Sand") }],
    specifications: [{ key: "Driver", value: "2 × 40mm + passive radiators" }, { key: "Battery Life", value: "20 hours" }, { key: "Waterproof", value: "IP67" }, { key: "Charging", value: "USB-C" }],
  },
  {
    id: "PRD-009", name: "PopSockets MagSafe Phone Grip", category: "Accessories", price: 24.99, stock: 143, status: "Active", revenue: 3748.50, sku: "POPS-MS-CLR",
    brand: "PopSockets", company: "PopSockets LLC", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Clear", "Black", "White", "Pink") }],
    specifications: [{ key: "Mount Type", value: "MagSafe" }, { key: "Collapsible", value: "Yes" }, { key: "Material", value: "Aluminum + Plastic" }],
  },
  {
    id: "PRD-010", name: "Belkin USB-C to USB-C Cable 6ft", category: "Power", price: 29.99, stock: 98, status: "Active", revenue: 3598.80, sku: "BLK-CAB-CC6",
    brand: "Belkin", company: "Belkin International", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "White") }, { name: "Length", options: opts("3ft", "6ft", "10ft") }],
    specifications: [{ key: "Max Power", value: "240W" }, { key: "Data Speed", value: "10Gbps" }, { key: "Certified", value: "USB-IF" }],
  },
  {
    id: "PRD-011", name: "OtterBox Symmetry MagSafe Case", category: "Cases", price: 59.99, stock: 67, status: "Active", revenue: 6718.88, sku: "77-92833",
    brand: "OtterBox", company: "Otter Products LLC", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Clear", "Pink", "Lavender") }, { name: "Model", options: opts("iPhone 16", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16 Pro Max") }],
    specifications: [{ key: "MagSafe", value: "Yes" }, { key: "Drop Protection", value: "3× Military Standard" }, { key: "Material", value: "Polycarbonate + TPE" }],
  },
  {
    id: "PRD-012", name: "JBL Tune Buds 2 ANC Earbuds", category: "Audio", price: 59.95, stock: 44, status: "Active", revenue: 5395.50, sku: "JBLTBUDS2BLKAM",
    brand: "JBL", company: "HARMAN International", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "White", "Purple") }],
    specifications: [{ key: "ANC", value: "Yes (4-mic)" }, { key: "Battery Life", value: "10 hrs + 40 hrs case" }, { key: "Bluetooth", value: "5.3" }, { key: "Water Resistance", value: "IPX4" }],
  },
  {
    id: "PRD-013", name: "Ventev Powercell 6000+ Battery", category: "Power", price: 39.99, stock: 18, status: "Out of Stock", revenue: 2399.40, sku: "VNT-6000",
    brand: "Ventev", company: "Mobi", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black") }],
    specifications: [{ key: "Capacity", value: "6,000 mAh" }, { key: "Output", value: "12W" }, { key: "Ports", value: "1× USB-A, 1× USB-C" }],
  },
  {
    id: "PRD-014", name: "JLAB Go Air POP True Wireless Earbuds", category: "Audio", price: 26.99, stock: 211, status: "Active", revenue: 2969.10, sku: "EBGAIRPOPRBLK124",
    brand: "JLab", company: "JLab Audio", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "White", "Teal", "Lilac") }],
    specifications: [{ key: "Battery Life", value: "8 hrs + 24 hrs case" }, { key: "Bluetooth", value: "5.1" }, { key: "Water Resistance", value: "IPX4" }],
  },
  {
    id: "PRD-015", name: "Kate Spade Grip & Stand", category: "Accessories", price: 44.99, stock: 0, status: "Out of Stock", revenue: 2249.50, sku: "KS-GRP-BLK",
    brand: "Kate Spade", company: "Tapestry Inc.", image: "", variantImages: [],
    variants: [{ name: "Design", options: opts("Black Logo", "Floral", "Leopard") }],
    specifications: [{ key: "Mount Type", value: "Adhesive + MagSafe" }, { key: "Material", value: "Premium Fabric + Metal" }],
  },
  {
    id: "PRD-016", name: "UAG Civilian MagSafe iPhone Case", category: "Cases", price: 59.95, stock: 53, status: "Active", revenue: 4196.50, sku: "114546114040",
    brand: "UAG", company: "Urban Armor Gear", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Olive", "Frosted Ice") }, { name: "Model", options: opts("iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max") }],
    specifications: [{ key: "MagSafe", value: "Yes" }, { key: "Drop Protection", value: "Military Grade" }, { key: "Material", value: "Feather-light composite" }],
  },
  {
    id: "PRD-017", name: "Oladance OWS Pro Earbuds", category: "Audio", price: 229.00, stock: 12, status: "Active", revenue: 9160.00, sku: "EBOLA07XPDEN01",
    brand: "Oladance", company: "Oladance Inc.", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Carbon Black", "Chalk White") }],
    specifications: [{ key: "Driver Size", value: "18mm planar" }, { key: "Battery Life", value: "20 hrs + 60 hrs case" }, { key: "Open-Ear", value: "Yes" }, { key: "Bluetooth", value: "5.3 Multipoint" }],
  },
  {
    id: "PRD-018", name: "Nite Ize Phone Loop Wallet", category: "Accessories", price: 19.99, stock: 88, status: "Active", revenue: 1799.10, sku: "NIITE-WLT-BLK",
    brand: "Nite Ize", company: "Nite Ize Inc.", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black", "Tan", "Blue") }],
    specifications: [{ key: "Card Capacity", value: "2–3 cards" }, { key: "Mount Type", value: "Adhesive" }, { key: "Material", value: "Elastic + Aluminum" }],
  },
  {
    id: "PRD-019", name: "JBL Quantum 100M2 Gaming Headset", category: "Audio", price: 29.95, stock: 0, status: "Draft", revenue: 0.00, sku: "JBLQTUM100M2BLKAM",
    brand: "JBL", company: "HARMAN International", image: "", variantImages: [],
    variants: [{ name: "Color", options: opts("Black") }],
    specifications: [{ key: "Driver Size", value: "40mm" }, { key: "Mic", value: "Detachable boom mic" }, { key: "Connection", value: "3.5mm + USB-A" }, { key: "Platform", value: "PC / PS / Xbox / Switch" }],
  },
  {
    id: "PRD-020", name: "Gadget Guard Black Ice Screen Guard", category: "Screen Protection", price: 39.99, stock: 62, status: "Active", revenue: 3199.20, sku: "GG-BI-IP17PM",
    brand: "Gadget Guard", company: "Gadget Guard LLC", image: "", variantImages: [],
    variants: [{ name: "Model", options: opts("iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "Galaxy S26 Ultra") }],
    specifications: [{ key: "Material", value: "Tempered Glass" }, { key: "Hardness", value: "9H" }, { key: "Case Friendly", value: "Yes" }, { key: "Coating", value: "Oleophobic" }],
  },
];

// ── Mock Customers (30) ───────────────────────────────────────────────────────

export const CUSTOMERS: Customer[] = [
  { id: "CUS-001", name: "James Carter",    email: "james@example.com",    phone: "(555) 101-2030", orders: 7,  totalSpent: 892.45,  lastOrder: "2025-05-14", joined: "2023-02-10", status: "Active",   city: "New York" },
  { id: "CUS-002", name: "Sofia Reyes",     email: "sofia@example.com",    phone: "(555) 202-3141", orders: 4,  totalSpent: 319.96,  lastOrder: "2025-05-14", joined: "2023-06-22", status: "Active",   city: "Los Angeles" },
  { id: "CUS-003", name: "Liam Johnson",    email: "liam@example.com",     phone: "(555) 303-4252", orders: 12, totalSpent: 1453.80, lastOrder: "2025-05-13", joined: "2022-11-05", status: "Active",   city: "Chicago" },
  { id: "CUS-004", name: "Emma Williams",   email: "emma@example.com",     phone: "(555) 404-5363", orders: 2,  totalSpent:  69.98,  lastOrder: "2025-05-13", joined: "2024-01-18", status: "Active",   city: "Houston" },
  { id: "CUS-005", name: "Noah Brown",      email: "noah@example.com",     phone: "(555) 505-6474", orders: 6,  totalSpent: 748.70,  lastOrder: "2025-05-12", joined: "2023-08-30", status: "Active",   city: "Phoenix" },
  { id: "CUS-006", name: "Ava Martinez",    email: "ava@example.com",      phone: "(555) 606-7585", orders: 3,  totalSpent: 189.93,  lastOrder: "2025-05-12", joined: "2024-03-14", status: "Inactive", city: "Philadelphia" },
  { id: "CUS-007", name: "Oliver Davis",    email: "oliver@example.com",   phone: "(555) 707-8696", orders: 15, totalSpent: 2341.25, lastOrder: "2025-05-11", joined: "2022-07-20", status: "Active",   city: "San Antonio" },
  { id: "CUS-008", name: "Isabella Wilson", email: "isabella@example.com", phone: "(555) 808-9707", orders: 5,  totalSpent: 434.75,  lastOrder: "2025-05-11", joined: "2023-04-09", status: "Active",   city: "San Diego" },
  { id: "CUS-009", name: "Elijah Taylor",   email: "elijah@example.com",   phone: "(555) 909-0818", orders: 8,  totalSpent: 879.20,  lastOrder: "2025-05-10", joined: "2023-01-25", status: "Active",   city: "Dallas" },
  { id: "CUS-010", name: "Mia Anderson",    email: "mia@example.com",      phone: "(555) 010-1929", orders: 1,  totalSpent:  26.99,  lastOrder: "2025-05-10", joined: "2025-04-01", status: "Active",   city: "San Jose" },
  { id: "CUS-011", name: "Lucas Thomas",    email: "lucas@example.com",    phone: "(555) 111-2030", orders: 9,  totalSpent: 1089.55, lastOrder: "2025-05-09", joined: "2022-12-15", status: "Active",   city: "Austin" },
  { id: "CUS-012", name: "Charlotte Garcia",email: "charlotte@example.com",phone: "(555) 212-3141", orders: 3,  totalSpent: 199.97,  lastOrder: "2025-05-09", joined: "2024-02-28", status: "Active",   city: "Jacksonville" },
  { id: "CUS-013", name: "Mason Lee",       email: "mason@example.com",    phone: "(555) 313-4252", orders: 11, totalSpent: 1234.65, lastOrder: "2025-05-08", joined: "2023-03-17", status: "Active",   city: "Columbus" },
  { id: "CUS-014", name: "Amelia Rodriguez",email: "amelia@example.com",   phone: "(555) 414-5363", orders: 4,  totalSpent: 289.80,  lastOrder: "2025-05-08", joined: "2023-09-12", status: "Active",   city: "Charlotte" },
  { id: "CUS-015", name: "Ethan Jackson",   email: "ethan@example.com",    phone: "(555) 515-6474", orders: 2,  totalSpent: 109.98,  lastOrder: "2025-05-07", joined: "2024-05-03", status: "Inactive", city: "Indianapolis" },
  { id: "CUS-016", name: "Harper White",    email: "harper@example.com",   phone: "(555) 616-7585", orders: 6,  totalSpent: 748.00,  lastOrder: "2025-05-07", joined: "2023-07-08", status: "Active",   city: "San Francisco" },
  { id: "CUS-017", name: "Aiden Harris",    email: "aiden@example.com",    phone: "(555) 717-8696", orders: 7,  totalSpent: 649.30,  lastOrder: "2025-05-06", joined: "2023-05-21", status: "Active",   city: "Seattle" },
  { id: "CUS-018", name: "Evelyn Martin",   email: "evelyn@example.com",   phone: "(555) 818-9707", orders: 10, totalSpent: 1198.50, lastOrder: "2025-05-06", joined: "2022-10-14", status: "Active",   city: "Denver" },
  { id: "CUS-019", name: "Sebastian Lewis", email: "sebastian@example.com",phone: "(555) 919-0818", orders: 3,  totalSpent: 239.93,  lastOrder: "2025-05-05", joined: "2024-01-07", status: "Active",   city: "Nashville" },
  { id: "CUS-020", name: "Aria Lee",        email: "aria@example.com",     phone: "(555) 020-1929", orders: 5,  totalSpent: 449.75,  lastOrder: "2025-05-05", joined: "2023-11-30", status: "Active",   city: "Baltimore" },
  { id: "CUS-021", name: "Jack Walker",     email: "jack@example.com",     phone: "(555) 121-2030", orders: 8,  totalSpent: 839.60,  lastOrder: "2025-05-04", joined: "2023-02-19", status: "Active",   city: "Oklahoma City" },
  { id: "CUS-022", name: "Scarlett Hall",   email: "scarlett@example.com", phone: "(555) 222-3141", orders: 4,  totalSpent: 329.80,  lastOrder: "2025-05-04", joined: "2023-08-05", status: "Active",   city: "Louisville" },
  { id: "CUS-023", name: "William Allen",   email: "william@example.com",  phone: "(555) 323-4252", orders: 2,  totalSpent: 129.90,  lastOrder: "2025-05-03", joined: "2024-04-16", status: "Active",   city: "Portland" },
  { id: "CUS-024", name: "Grace Young",     email: "grace@example.com",    phone: "(555) 424-5363", orders: 13, totalSpent: 1789.40, lastOrder: "2025-05-03", joined: "2022-09-03", status: "Active",   city: "Las Vegas" },
  { id: "CUS-025", name: "Henry King",      email: "henry@example.com",    phone: "(555) 525-6474", orders: 1,  totalSpent:  29.95,  lastOrder: "2025-05-02", joined: "2025-03-22", status: "Active",   city: "Memphis" },
  { id: "CUS-026", name: "Zoey Wright",     email: "zoey@example.com",     phone: "(555) 626-7585", orders: 3,  totalSpent: 249.85,  lastOrder: "2025-05-02", joined: "2023-12-11", status: "Inactive", city: "Atlanta" },
  { id: "CUS-027", name: "Jackson Scott",   email: "jackson@example.com",  phone: "(555) 727-8696", orders: 6,  totalSpent: 539.70,  lastOrder: "2025-05-01", joined: "2023-06-27", status: "Active",   city: "Minneapolis" },
  { id: "CUS-028", name: "Luna Torres",     email: "luna@example.com",     phone: "(555) 828-9707", orders: 9,  totalSpent: 1059.65, lastOrder: "2025-05-01", joined: "2022-11-19", status: "Active",   city: "New Orleans" },
  { id: "CUS-029", name: "Logan Nguyen",    email: "logan@example.com",    phone: "(555) 929-0818", orders: 4,  totalSpent: 299.96,  lastOrder: "2025-04-30", joined: "2023-10-05", status: "Active",   city: "Cleveland" },
  { id: "CUS-030", name: "Chloe Hill",      email: "chloe@example.com",    phone: "(555) 030-1929", orders: 7,  totalSpent: 789.30,  lastOrder: "2025-04-30", joined: "2023-04-23", status: "Active",   city: "Tampa" },
];

// ── Summary stats ─────────────────────────────────────────────────────────────

export const STATS = {
  totalRevenue:   8432.65,
  revenueChange:  12.4,
  totalOrders:    50,
  ordersChange:   8.1,
  totalCustomers: 30,
  customersChange: 5.3,
  avgOrderValue:  97.10,
  avgOrderChange: 3.8,
};

// Weekly revenue (last 7 days)
export const WEEKLY_REVENUE = [
  { day: "Mon", amount: 1240 },
  { day: "Tue", amount: 890  },
  { day: "Wed", amount: 1560 },
  { day: "Thu", amount: 1120 },
  { day: "Fri", amount: 1890 },
  { day: "Sat", amount: 2340 },
  { day: "Sun", amount: 1680 },
];

// Monthly revenue (last 6 months)
export const MONTHLY_REVENUE = [
  { month: "Dec", amount: 18200 },
  { month: "Jan", amount: 21400 },
  { month: "Feb", amount: 19800 },
  { month: "Mar", amount: 24600 },
  { month: "Apr", amount: 22100 },
  { month: "May", amount: 28400 },
];

// ── Mock Repair Bookings (20) ─────────────────────────────────────────────────

export const REPAIR_BOOKINGS: RepairBooking[] = [
  { id: "REP-001", customer: "James Carter",     email: "james@example.com",    phone: "(555) 101-2030", device: "Phone",    brand: "Apple",   model: "iPhone 16 Pro",    issue: "Screen Replacement",    delivery: "Drop-off", dateBooked: "2025-05-14", scheduledDate: "2025-05-15", status: "Completed",  estimate: 189.99, technician: "Mike R." },
  { id: "REP-002", customer: "Sofia Reyes",      email: "sofia@example.com",    phone: "(555) 202-3141", device: "Phone",    brand: "Samsung", model: "Galaxy S26 Ultra", issue: "Battery Replacement",   delivery: "Drop-off", dateBooked: "2025-05-14", scheduledDate: "2025-05-16", status: "In Repair",  estimate:  79.99, technician: "Sarah K." },
  { id: "REP-003", customer: "Liam Johnson",     email: "liam@example.com",     phone: "(555) 303-4252", device: "Tablet",   brand: "Apple",   model: "iPad Pro 13\"",    issue: "Charging Port Repair",  delivery: "Mail-in",  dateBooked: "2025-05-13", scheduledDate: "2025-05-17", status: "Pending",    estimate:  64.99, technician: "—" },
  { id: "REP-004", customer: "Emma Williams",    email: "emma@example.com",     phone: "(555) 404-5363", device: "Phone",    brand: "Apple",   model: "iPhone 15",        issue: "Back Glass Repair",     delivery: "Drop-off", dateBooked: "2025-05-13", scheduledDate: "2025-05-14", status: "Ready",      estimate: 129.99, technician: "Mike R." },
  { id: "REP-005", customer: "Noah Brown",       email: "noah@example.com",     phone: "(555) 505-6474", device: "Computer", brand: "Apple",   model: "MacBook Air M3",   issue: "Keyboard Replacement",  delivery: "Drop-off", dateBooked: "2025-05-12", scheduledDate: "2025-05-18", status: "Diagnosing", estimate: 249.00, technician: "David L." },
  { id: "REP-006", customer: "Ava Martinez",     email: "ava@example.com",      phone: "(555) 606-7585", device: "Phone",    brand: "Google",  model: "Pixel 9 Pro",      issue: "Water Damage",          delivery: "Mail-in",  dateBooked: "2025-05-12", scheduledDate: "2025-05-19", status: "Cancelled",  estimate:   0.00, technician: "—" },
  { id: "REP-007", customer: "Oliver Davis",     email: "oliver@example.com",   phone: "(555) 707-8696", device: "Phone",    brand: "Samsung", model: "Galaxy S25",        issue: "Screen Replacement",    delivery: "Drop-off", dateBooked: "2025-05-11", scheduledDate: "2025-05-12", status: "Completed",  estimate: 159.99, technician: "Sarah K." },
  { id: "REP-008", customer: "Isabella Wilson",  email: "isabella@example.com", phone: "(555) 808-9707", device: "Tablet",   brand: "Samsung", model: "Galaxy Tab S10",   issue: "Cracked Screen",        delivery: "Drop-off", dateBooked: "2025-05-11", scheduledDate: "2025-05-16", status: "In Repair",  estimate: 199.99, technician: "Mike R." },
  { id: "REP-009", customer: "Elijah Taylor",    email: "elijah@example.com",   phone: "(555) 909-0818", device: "Phone",    brand: "Apple",   model: "iPhone 16",        issue: "Face ID Not Working",   delivery: "Drop-off", dateBooked: "2025-05-10", scheduledDate: "2025-05-15", status: "Completed",  estimate:  89.99, technician: "David L." },
  { id: "REP-010", customer: "Mia Anderson",     email: "mia@example.com",      phone: "(555) 010-1929", device: "Phone",    brand: "Apple",   model: "iPhone 14 Pro",    issue: "Battery Replacement",   delivery: "Mail-in",  dateBooked: "2025-05-10", scheduledDate: "2025-05-18", status: "Pending",    estimate:  74.99, technician: "—" },
  { id: "REP-011", customer: "Lucas Thomas",     email: "lucas@example.com",    phone: "(555) 111-2030", device: "Computer", brand: "Dell",    model: "XPS 15",           issue: "SSD Upgrade",           delivery: "Drop-off", dateBooked: "2025-05-09", scheduledDate: "2025-05-13", status: "Completed",  estimate: 149.00, technician: "Sarah K." },
  { id: "REP-012", customer: "Charlotte Garcia", email: "charlotte@example.com",phone: "(555) 212-3141", device: "Phone",    brand: "Samsung", model: "Galaxy A55",       issue: "Microphone Issue",      delivery: "Drop-off", dateBooked: "2025-05-09", scheduledDate: "2025-05-17", status: "Diagnosing", estimate:  49.99, technician: "David L." },
  { id: "REP-013", customer: "Mason Lee",        email: "mason@example.com",    phone: "(555) 313-4252", device: "Phone",    brand: "Apple",   model: "iPhone 16 Pro Max", issue: "Screen Replacement",   delivery: "Drop-off", dateBooked: "2025-05-08", scheduledDate: "2025-05-09", status: "Completed",  estimate: 219.99, technician: "Mike R." },
  { id: "REP-014", customer: "Amelia Rodriguez", email: "amelia@example.com",   phone: "(555) 414-5363", device: "Tablet",   brand: "Apple",   model: "iPad Air 6",       issue: "Battery Swollen",       delivery: "Mail-in",  dateBooked: "2025-05-08", scheduledDate: "2025-05-20", status: "Pending",    estimate:  99.99, technician: "—" },
  { id: "REP-015", customer: "Ethan Jackson",    email: "ethan@example.com",    phone: "(555) 515-6474", device: "Phone",    brand: "OnePlus", model: "OnePlus 13",       issue: "Speaker Repair",        delivery: "Drop-off", dateBooked: "2025-05-07", scheduledDate: "2025-05-11", status: "Completed",  estimate:  59.99, technician: "Sarah K." },
  { id: "REP-016", customer: "Harper White",     email: "harper@example.com",   phone: "(555) 616-7585", device: "Computer", brand: "Apple",   model: "MacBook Pro M4",   issue: "Trackpad Repair",       delivery: "Drop-off", dateBooked: "2025-05-07", scheduledDate: "2025-05-19", status: "In Repair",  estimate: 179.00, technician: "David L." },
  { id: "REP-017", customer: "Aiden Harris",     email: "aiden@example.com",    phone: "(555) 717-8696", device: "Phone",    brand: "Apple",   model: "iPhone 15 Plus",   issue: "Camera Not Working",    delivery: "Drop-off", dateBooked: "2025-05-06", scheduledDate: "2025-05-10", status: "Completed",  estimate: 109.99, technician: "Mike R." },
  { id: "REP-018", customer: "Evelyn Martin",    email: "evelyn@example.com",   phone: "(555) 818-9707", device: "Phone",    brand: "Samsung", model: "Galaxy Z Fold 6",  issue: "Hinge Repair",          delivery: "Mail-in",  dateBooked: "2025-05-06", scheduledDate: "2025-05-21", status: "Pending",    estimate: 299.99, technician: "—" },
  { id: "REP-019", customer: "Sebastian Lewis",  email: "sebastian@example.com",phone: "(555) 919-0818", device: "Phone",    brand: "Apple",   model: "iPhone 16",        issue: "Charging Port Repair",  delivery: "Drop-off", dateBooked: "2025-05-05", scheduledDate: "2025-05-08", status: "Completed",  estimate:  64.99, technician: "Sarah K." },
  { id: "REP-020", customer: "Aria Lee",         email: "aria@example.com",     phone: "(555) 020-1929", device: "Tablet",   brand: "Samsung", model: "Galaxy Tab S9",    issue: "Screen Flickering",     delivery: "Drop-off", dateBooked: "2025-05-05", scheduledDate: "2025-05-16", status: "Ready",      estimate: 139.99, technician: "David L." },
];

// ── Mock Repair Applications (15) ────────────────────────────────────────────

export const REPAIR_APPLICATIONS: RepairApplication[] = [
  { id: "APP-001", customer: "Hazel Rogers",    email: "hazel@example.com",   phone: "(555) 030-1929", device: "Phone",    brand: "Apple",   model: "iPhone 16 Pro",   issue: "Screen Cracked",        description: "Dropped the phone and the screen is shattered on the bottom half. Touch still partially works.", submittedAt: "2025-05-16 09:12", status: "New" },
  { id: "APP-002", customer: "Eli Morris",      email: "eli@example.com",     phone: "(555) 929-0818", device: "Computer", brand: "Apple",   model: "MacBook Air M2",  issue: "Not Turning On",        description: "Device stopped turning on after a software update. Tried resetting but no response.", submittedAt: "2025-05-16 08:45", status: "Reviewed" },
  { id: "APP-003", customer: "Aurora Sanchez",  email: "aurora@example.com",  phone: "(555) 828-9707", device: "Phone",    brand: "Samsung", model: "Galaxy S25+",     issue: "Battery Draining Fast", description: "Battery goes from 100% to 20% in about 3 hours. Happens since last Android update.", submittedAt: "2025-05-15 17:30", status: "Quoted" },
  { id: "APP-004", customer: "Leo Stewart",     email: "leo@example.com",     phone: "(555) 727-8696", device: "Tablet",   brand: "Apple",   model: "iPad Pro 11\"",   issue: "Cracked Screen",        description: "Screen cracked after a fall. Touchscreen still works but there are deep cracks.", submittedAt: "2025-05-15 14:20", status: "New" },
  { id: "APP-005", customer: "Ellie Collins",   email: "ellie@example.com",   phone: "(555) 626-7585", device: "Phone",    brand: "Google",  model: "Pixel 9",         issue: "Camera Blurry",         description: "Front camera is permanently blurry. Cleaned the lens but no improvement.", submittedAt: "2025-05-15 11:05", status: "Reviewed" },
  { id: "APP-006", customer: "Owen Edwards",    email: "owen@example.com",    phone: "(555) 525-6474", device: "Phone",    brand: "Apple",   model: "iPhone 15 Pro",   issue: "Water Damage",          description: "Phone fell into swimming pool. Now has green lines on display and speaker crackles.", submittedAt: "2025-05-14 16:50", status: "Quoted" },
  { id: "APP-007", customer: "Violet Evans",    email: "violet@example.com",  phone: "(555) 424-5363", device: "Computer", brand: "Dell",    model: "Inspiron 15",     issue: "Keyboard Not Working",  description: "Several keys stopped working. Tried reinstalling drivers but still not working.", submittedAt: "2025-05-14 13:30", status: "New" },
  { id: "APP-008", customer: "Isaac Parker",    email: "isaac@example.com",   phone: "(555) 323-4252", device: "Phone",    brand: "Samsung", model: "Galaxy A35",      issue: "Charging Issue",        description: "Phone only charges when cable is held at a specific angle. Probably port damage.", submittedAt: "2025-05-14 10:15", status: "New" },
  { id: "APP-009", customer: "Stella Campbell", email: "stella@example.com",  phone: "(555) 222-3141", device: "Phone",    brand: "Apple",   model: "iPhone 14",       issue: "Face ID Not Working",   description: "Face ID stopped recognizing me after I changed my screen protector.", submittedAt: "2025-05-13 15:40", status: "Reviewed" },
  { id: "APP-010", customer: "Nathan Phillips", email: "nathan@example.com",  phone: "(555) 121-2030", device: "Tablet",   brand: "Samsung", model: "Galaxy Tab S8",   issue: "Speaker Damage",        description: "Sound is distorted and crackling. Happens on all apps and volume levels.", submittedAt: "2025-05-13 12:00", status: "Rejected" },
  { id: "APP-011", customer: "Luna Torres",     email: "luna@example.com",    phone: "(555) 828-9707", device: "Phone",    brand: "Apple",   model: "iPhone 16",       issue: "Back Glass Broken",     description: "Back glass shattered from a drop. Phone works fine otherwise.", submittedAt: "2025-05-13 09:25", status: "Quoted" },
  { id: "APP-012", customer: "Jackson Scott",   email: "jackson@example.com", phone: "(555) 727-8696", device: "Computer", brand: "HP",      model: "Spectre x360",    issue: "Overheating",           description: "Laptop shuts down randomly under load. Fans run at full speed constantly.", submittedAt: "2025-05-12 16:10", status: "New" },
  { id: "APP-013", customer: "Zoey Wright",     email: "zoey@example.com",    phone: "(555) 626-7585", device: "Phone",    brand: "OnePlus", model: "OnePlus 12",      issue: "Screen Replacement",    description: "Display has a large black spot in the center spreading slowly.", submittedAt: "2025-05-12 11:45", status: "Reviewed" },
  { id: "APP-014", customer: "Henry King",      email: "henry@example.com",   phone: "(555) 525-6474", device: "Phone",    brand: "Apple",   model: "iPhone 13 Mini",  issue: "Battery Replacement",   description: "Battery health dropped to 71%. Phone shuts down at 30% battery.", submittedAt: "2025-05-11 14:30", status: "Quoted" },
  { id: "APP-015", customer: "Grace Young",     email: "grace@example.com",   phone: "(555) 424-5363", device: "Tablet",   brand: "Apple",   model: "iPad Mini 7",     issue: "Touch Screen Issue",    description: "Bottom portion of the screen doesn't respond to touch. Restart didn't help.", submittedAt: "2025-05-11 10:00", status: "New" },
];
