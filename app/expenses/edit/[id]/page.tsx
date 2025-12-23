import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ExpenseForm from "@/components/ExpenseForm";

export default async function EditExpensePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <ExpenseForm expenseId={parseInt(params.id)} />;
}

