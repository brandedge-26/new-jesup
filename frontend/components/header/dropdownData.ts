export type DropdownItem = {
  label: string;
  image?: string;
  href: string;
  isArrow?: boolean;
};

export type DropdownPanel = {
  icon: string;
  title: string;
  description: string;
  shopLink?: { label: string; href: string };
  items: DropdownItem[];
};

export type NavItem = {
  label: string;
  href?: string;
  dropdown?: DropdownPanel;
};

export const navItems: NavItem[] = [
  {
    label: "Phone repairs",
    dropdown: {
      icon: "/header-images/icons/phone-repair.svg",
      title: "Your phone is in good hands",
      description:
        "Get free diagnostics, screen repairs, and low prices at 700+ stores.",
      items: [
        {
          label: "iPhone",
          image: "/header-images/phone-repair/iphone.png",
          href: "/repairs/smartphone/iphone",
        },
        {
          label: "Samsung",
          image: "/header-images/phone-repair/samsung.png",
          href: "/repairs/smartphone/samsung",
        },
        {
          label: "Google",
          image: "/header-images/phone-repair/google.png",
          href: "/repairs/smartphone/google",
        },
        {
          label: "Motorola",
          image: "/header-images/phone-repair/motorola.png",
          href: "/repairs/smartphone/motorola",
        },
        {
          label: "LG",
          image: "/header-images/phone-repair/LG.png",
          href: "/repairs/smartphone/lg",
        },
        { label: "All repair options", href: "/repairs/smartphone", isArrow: true },
      ],
    },
  },
  {
    label: "Tech repairs",
    dropdown: {
      icon: "/header-images/icons/tech-repair.svg",
      title: "Expert fixes for your favorite tech",
      description:
        "We fix anything with a power button. Select a device to get started.",
      items: [
        {
          label: "iPad",
          image: "/header-images/tech-repair/ipad.png",
          href: "/repairs/tablets/ipads",
        },
        {
          label: "Tablet",
          image: "/header-images/tech-repair/tablet.png",
          href: "/repairs/tablets",
        },
        {
          label: "Computer",
          image: "/header-images/tech-repair/computer.png",
          href: "/repairs/laptop-computers",
        },
        {
          label: "Gaming console",
          image: "/header-images/tech-repair/game-console.png",
          href: "/repairs/gaming-console",
        },
        {
          label: "Something else",
          image: "/header-images/tech-repair/something-else.png",
          href: "/repairs/something-else",
        },
        { label: "All repair options", href: "/repairs/tech", isArrow: true },
      ],
    },
  },
  {
    label: "Shop accessories",
    dropdown: {
      icon: "/header-images/icons/shop-accessories.svg",
      title: "Shop at Jesup",
      description:
        "Browse our selection of handpicked accessories, tech gear, and more—now available at Jesup.",
      shopLink: { label: "Shop now", href: "https://shop.jesupwireless.com/collections" },
      items: [
        {
          label: "Cases",
          image: "/header-images/shop-accossories/case.png",
          href: "https://shop.jesupwireless.com/collections/cases",
        },
        {
          label: "Screen protectors",
          image: "/header-images/shop-accossories/screen-protector.png",
          href: "https://shop.jesupwireless.com/collections/screen-protection",
        },
        {
          label: "Power",
          image: "/header-images/shop-accossories/power-accessories.png",
          href: "https://shop.jesupwireless.com/collections/power",
        },
        {
          label: "All iPhone",
          image: "/header-images/shop-accossories/iphone.png",
          href: "https://shop.jesupwireless.com/collections/devices?q=phone",
        },
        {
          label: "All Samsung",
          image: "/header-images/shop-accossories/samsung.png",
          href: "https://shop.jesupwireless.com/collections/devices?q=samsung",
        },
        {
          label: "All Google",
          image: "/header-images/shop-accossories/pixel.png",
          href: "https://shop.jesupwireless.com/collections/devices?q=google",
        },
        {
          label: "Audio",
          image: "/header-images/shop-accossories/audio.png",
          href: "https://shop.jesupwireless.com/collections/audio",
        },
        {
          label: "Tablet and laptop",
          image: "/header-images/shop-accossories/tablet-and-laptop.png",
          href: "https://shop.jesupwireless.com/collections/devices?q=tablet+laptop",
        },
        {
          label: "Shop all accessories",
          href: "https://shop.jesupwireless.com/collections",
          isArrow: true,
        },
      ],
    },
  },
  {
    label: "Repair guides",
    href: "/repair-guides",
  },
];
