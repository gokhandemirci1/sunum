import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ExpensesClient from "@/components/ExpensesClient";

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <ExpensesClient />;
}

