import { techDevices } from "../techData";
import TechRepairPage from "../TechRepairPage";

export const metadata = {
  title: "Gaming Console Repair | Jesup",
  description: techDevices["gaming-console"].description,
};

export default function GamingConsoleRepairPage() {
  return <TechRepairPage data={techDevices["gaming-console"]} />;
}
