import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "weekly":
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "sixmonths":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        break;
      default:
        startDate = new Date(0);
    }

    // Get totals
    const weeklyStart = new Date(now);
    weeklyStart.setDate(now.getDate() - now.getDay());
    weeklyStart.setHours(0, 0, 0, 0);

    const monthlyStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const sixMonthsStart = new Date(now);
    sixMonthsStart.setMonth(now.getMonth() - 6);

    const [weeklyTotal, monthlyTotal, sixMonthsTotal] = await Promise.all([
      prisma.expense.aggregate({
        where: {
          userId,
          expenseDate: { gte: weeklyStart, lte: now }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: {
          userId,
          expenseDate: { gte: monthlyStart, lte: now }
        },
        _sum: { amount: true }
      }),
      prisma.expense.aggregate({
        where: {
          userId,
          expenseDate: { gte: sixMonthsStart, lte: now }
        },
        _sum: { amount: true }
      })
    ]);

    // Get expenses by category for charts
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        expenseDate: { gte: startDate, lte: now }
      },
      include: {
        category: true
      }
    });

    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const categoryName = expense.category.name;
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = 0;
      }
      categoryTotals[categoryName] += Number(expense.amount);
    });

    return NextResponse.json({
      weeklyTotal: Number(weeklyTotal._sum.amount || 0),
      monthlyTotal: Number(monthlyTotal._sum.amount || 0),
      sixMonthsTotal: Number(sixMonthsTotal._sum.amount || 0),
      byCategory: categoryTotals
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

