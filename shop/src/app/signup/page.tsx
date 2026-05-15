import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Jesup Shop account and start shopping.",
};

export default function SignupPage() {
  return <SignupForm />;
}
