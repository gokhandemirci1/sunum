import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, password, confirmPassword } = await request.json();

    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Kullanıcı adı ve şifre gereklidir." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Şifreler eşleşmiyor." },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Şifre en az 4 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten kullanılıyor." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash
      }
    });

    return NextResponse.json(
      { message: "Kayıt başarılı", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}

