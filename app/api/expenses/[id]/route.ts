import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const expenseId = parseInt(params.id);
    const { amount, description, expenseDate, categoryId } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Tutar 0'dan büyük olmalıdır." },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, userId }
    });

    if (!expense) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Verify category belongs to user
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId }
      });

      if (!category) {
        return NextResponse.json(
          { error: "Geçersiz kategori." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: parseFloat(amount),
        description: description?.trim() || expense.description,
        expenseDate: expenseDate ? new Date(expenseDate) : expense.expenseDate,
        categoryId: categoryId || expense.categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update expense error:", error);
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
    const expenseId = parseInt(params.id);

    const expense = await prisma.expense.findFirst({
      where: { id: expenseId, userId }
    });

    if (!expense) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

