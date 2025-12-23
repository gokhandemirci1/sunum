import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const categoryId = parseInt(params.id);
    const { name, description, color } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Kategori adı gereklidir." },
        { status: 400 }
      );
    }

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId }
    });

    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || category.color
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const categoryId = parseInt(params.id);

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId }
    });

    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Bu kategori silinemez. Bu kategoriye ait harcamalar bulunmaktadır." },
      { status: 400 }
    );
  }
}

