import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ExpensesClient from "@/components/ExpensesClient";

export default async function ExpensesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <ExpensesClient />;
}

