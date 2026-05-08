import { techDevices } from "../techData";
import TechRepairPage from "../TechRepairPage";

export const metadata = {
  title: "Computer & Laptop Repair | Jesup",
  description: techDevices["laptop-computers"].description,
};

export default function ComputerRepairPage() {
  return <TechRepairPage data={techDevices["laptop-computers"]} />;
}
