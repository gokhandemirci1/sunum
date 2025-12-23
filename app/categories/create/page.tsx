import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import CategoryForm from "@/components/CategoryForm";

export const dynamic = 'force-dynamic';

export default async function CreateCategoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <CategoryForm />;
}

