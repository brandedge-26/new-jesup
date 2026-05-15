import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Jesup Shop account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
