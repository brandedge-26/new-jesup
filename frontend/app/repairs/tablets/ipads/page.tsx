import { techDevices } from "../../techData";
import TechRepairPage from "../../TechRepairPage";

export const metadata = {
  title: "iPad Repair | Jesup",
  description: techDevices.ipads.description,
};

export default function IpadRepairPage() {
  return <TechRepairPage data={techDevices.ipads} />;
}
