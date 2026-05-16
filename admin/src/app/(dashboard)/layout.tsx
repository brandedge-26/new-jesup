import Sidebar from "@/components/Sidebar";
import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
