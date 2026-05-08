import { techDevices } from "../techData";
import TechRepairPage from "../TechRepairPage";

export const metadata = {
  title: "Tablet Repair | Jesup",
  description: techDevices.tablets.description,
};

export default function TabletRepairPage() {
  return <TechRepairPage data={techDevices.tablets} />;
}
