import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard, expenses, and categories routes
        if (req.nextUrl.pathname.startsWith("/dashboard") ||
            req.nextUrl.pathname.startsWith("/expenses") ||
            req.nextUrl.pathname.startsWith("/categories")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/account/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/expenses/:path*", "/categories/:path*"],
};

