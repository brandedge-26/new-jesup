"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type DeviceType = "phone" | "tablet" | "computer" | "game-console" | "";

export interface AppointmentState {
  deviceType: DeviceType;
  brand: string;
  model: string;
  damageTypes: string[];
  damageDescription: string;
  zipCode: string;
  streetAddress: string;
  location: { lat: number; lng: number; display: string } | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
}

const defaultState: AppointmentState = {
  deviceType: "",
  brand: "",
  model: "",
  damageTypes: [],
  damageDescription: "",
  zipCode: "",
  streetAddress: "",
  location: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  marketingOptIn: false,
};

interface AppointmentContextType {
  state: AppointmentState;
  update: (partial: Partial<AppointmentState>) => void;
  reset: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppointmentState>(defaultState);

  useEffect(() => {
    const stored = localStorage.getItem("jesup_appointment");
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const update = (partial: Partial<AppointmentState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("jesup_appointment", JSON.stringify(next));
      return next;
    });
  };

  const reset = () => {
    localStorage.removeItem("jesup_appointment");
    setState(defaultState);
  };

  return (
    <AppointmentContext.Provider value={{ state, update, reset }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const ctx = useContext(AppointmentContext);
  if (!ctx)
    throw new Error("useAppointment must be used within AppointmentProvider");
  return ctx;
}

/* ── Device data ── */
export const deviceLabels: Record<string, string> = {
  phone: "Phone",
  tablet: "Tablet",
  computer: "Computer",
  "game-console": "Game Console",
};

export const brandsByDevice: Record<string, string[]> = {
  phone: ["Apple (iPhone)", "Samsung", "Google (Pixel)", "OnePlus", "Other"],
  tablet: ["Apple (iPad)", "Samsung", "Microsoft (Surface)", "Other"],
  computer: ["Apple (MacBook)", "Dell", "HP", "Lenovo", "Asus", "Other"],
  "game-console": ["Sony (PlayStation)", "Microsoft (Xbox)", "Nintendo", "Other"],
};

export const modelsByBrand: Record<string, string[]> = {
  "Apple (iPhone)": [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14",
    "iPhone 13",
    "iPhone 12",
    "iPhone 11",
    "Other iPhone",
  ],
  Samsung: [
    "Galaxy S25 Ultra",
    "Galaxy S25+",
    "Galaxy S25",
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S23",
    "Galaxy A55",
    "Galaxy A35",
    "Galaxy A15",
    "Other Samsung",
  ],
  "Google (Pixel)": [
    "Pixel 9 Pro XL",
    "Pixel 9 Pro Fold",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 8 Pro",
    "Pixel 8a",
    "Pixel 8",
    "Pixel 7 Pro",
    "Pixel 7a",
    "Pixel 7",
    "Other Pixel",
  ],
  OnePlus: [
    "OnePlus 13",
    "OnePlus 12",
    "OnePlus Nord 4",
    "OnePlus Nord CE 4",
    "Other OnePlus",
  ],
  "Apple (iPad)": [
    "iPad Pro 13-inch (M4)",
    "iPad Pro 11-inch (M4)",
    "iPad Air 13-inch (M2)",
    "iPad Air 11-inch (M2)",
    "iPad mini (7th gen)",
    "iPad (10th gen)",
    "iPad (9th gen)",
    "Other iPad",
  ],
  "Microsoft (Surface)": [
    "Surface Pro 11",
    "Surface Pro 10",
    "Surface Pro 9",
    "Surface Laptop 7",
    "Surface Laptop 6",
    "Surface Go 4",
    "Other Surface",
  ],
  "Apple (MacBook)": [
    "MacBook Pro 16\" (M4)",
    "MacBook Pro 14\" (M4)",
    "MacBook Air 15\" (M3)",
    "MacBook Air 13\" (M3)",
    "MacBook Air 13\" (M2)",
    "MacBook Air 13\" (M1)",
    "Other MacBook",
  ],
  Dell: [
    "XPS 15",
    "XPS 13",
    "Inspiron 15",
    "Inspiron 14",
    "Latitude 15",
    "Other Dell",
  ],
  HP: [
    "Spectre x360 14",
    "Spectre x360 16",
    "Envy x360 15",
    "Pavilion 15",
    "EliteBook 840",
    "Other HP",
  ],
  Lenovo: [
    "ThinkPad X1 Carbon",
    "ThinkPad T14",
    "IdeaPad 5",
    "Yoga 9i",
    "Legion 5",
    "Other Lenovo",
  ],
  Asus: [
    "ZenBook 14",
    "ZenBook Pro 16X",
    "ROG Zephyrus G14",
    "VivoBook 15",
    "Other Asus",
  ],
  "Sony (PlayStation)": [
    "PlayStation 5",
    "PlayStation 5 Slim",
    "PlayStation 4 Pro",
    "PlayStation 4 Slim",
    "PlayStation 4",
    "Other PlayStation",
  ],
  "Microsoft (Xbox)": [
    "Xbox Series X",
    "Xbox Series S",
    "Xbox One X",
    "Xbox One S",
    "Xbox One",
    "Other Xbox",
  ],
  Nintendo: [
    "Nintendo Switch OLED",
    "Nintendo Switch Lite",
    "Nintendo Switch",
    "Nintendo 3DS",
    "Other Nintendo",
  ],
  Other: ["Other Device"],
};

export const damageOptions = [
  "Cracked / Broken Screen",
  "Battery Not Lasting",
  "Charging Port Issue",
  "Water / Liquid Damage",
  "Camera Not Working",
  "Speaker Not Working",
  "Microphone Issue",
  "Won't Turn On",
  "Slow Performance / Software Issue",
  "Back Cover / Housing Damage",
  "Overheating",
  "I Don't Know / Other",
];
