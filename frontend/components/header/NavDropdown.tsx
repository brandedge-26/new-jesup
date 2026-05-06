import Image from "next/image";
import Link from "next/link";
import type { DropdownPanel } from "./dropdownData";

interface NavDropdownProps {
  panel: DropdownPanel;
}

function ArrowCircle() {
  return (
    <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center">
      <svg
        className="w-5 h-5 text-gray-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        />
      </svg>
    </div>
  );
}

export default function NavDropdown({ panel }: NavDropdownProps) {
  return (
    <div className="flex gap-8 p-6">
      {/* Left info panel */}
      <div className="w-52 flex-shrink-0 flex flex-col">
        <div className="w-10 h-10 relative">
          <Image src={panel.icon} alt="" fill className="object-contain" />
        </div>
        <h3 className="mt-3 text-xl font-semibold text-gray-900 leading-snug">
          {panel.title}
        </h3>
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          {panel.description}
        </p>
        {panel.shopLink && (
          <Link
            href={panel.shopLink.href}
            className="mt-3 inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
          >
            {panel.shopLink.label}
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Right grid panel */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {panel.items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
          >
            {item.isArrow ? (
              <ArrowCircle />
            ) : (
              <div className="relative w-20 h-16">
                <Image
                  src={item.image!}
                  alt={item.label}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-xs text-gray-700 text-center font-medium group-hover:text-gray-900 leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
