import { AppointmentProvider } from "./_context/AppointmentContext";
import Sidebar from "./_components/Sidebar";

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppointmentProvider>
      <div className="flex flex-1 min-h-0 bg-gray-50/40">
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        <Sidebar />
      </div>
    </AppointmentProvider>
  );
}
