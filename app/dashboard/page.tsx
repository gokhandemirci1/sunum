import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/account/login");
    }

    return <DashboardClient />;
  } catch (error) {
    console.error("Dashboard page error:", error);
    redirect("/account/login");
  }
}

