import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ExpenseForm from "@/components/ExpenseForm";

export const dynamic = 'force-dynamic';

export default async function CreateExpensePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <ExpenseForm />;
}

