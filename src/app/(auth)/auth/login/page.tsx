import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ServerLoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  // Client-side login component is already created at /(client)/auth/login,
  // so we'll just redirect there
  redirect("/(client)/auth/login");
} 