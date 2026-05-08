import { techDevices } from "../techData";
import TechRepairPage from "../TechRepairPage";

export const metadata = {
  title: "Other Device Repair | Jesup",
  description: techDevices["something-else"].description,
};

export default function SomethingElseRepairPage() {
  return <TechRepairPage data={techDevices["something-else"]} />;
}
