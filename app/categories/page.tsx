import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CategoriesClient from "@/components/CategoriesClient";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <CategoriesClient />;
}

