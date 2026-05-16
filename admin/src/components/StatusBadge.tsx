type BadgeVariant =
  | "Delivered" | "Shipped" | "Processing" | "Pending" | "Cancelled"
  | "Active" | "Draft" | "Out of Stock"
  | "Inactive";

const STYLES: Record<string, string> = {
  Delivered:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Shipped:        "bg-blue-50   text-blue-700   border border-blue-200",
  Processing:     "bg-violet-50 text-violet-700 border border-violet-200",
  Pending:        "bg-amber-50  text-amber-700  border border-amber-200",
  Cancelled:      "bg-red-50    text-red-600    border border-red-200",
  Active:         "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Draft:          "bg-gray-100  text-gray-600   border border-gray-200",
  "Out of Stock": "bg-red-50    text-red-600    border border-red-200",
  Inactive:       "bg-gray-100  text-gray-500   border border-gray-200",
};

const DOTS: Record<string, string> = {
  Delivered:      "bg-emerald-500",
  Shipped:        "bg-blue-500",
  Processing:     "bg-violet-500",
  Pending:        "bg-amber-500",
  Cancelled:      "bg-red-500",
  Active:         "bg-emerald-500",
  Draft:          "bg-gray-400",
  "Out of Stock": "bg-red-500",
  Inactive:       "bg-gray-400",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLES[status] ?? "bg-gray-100 text-gray-600 border border-gray-200";
  const dot   = DOTS[status]  ?? "bg-gray-400";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      {status}
    </span>
  );
}
