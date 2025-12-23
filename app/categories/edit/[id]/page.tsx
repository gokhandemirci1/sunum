import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import CategoryForm from "@/components/CategoryForm";

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/login");
  }

  return <CategoryForm categoryId={parseInt(params.id)} />;
}

