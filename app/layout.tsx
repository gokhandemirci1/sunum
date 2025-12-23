import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/globals.css";
import Navigation from "@/components/Navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: "BudgetTracker",
  description: "Kişisel Bütçe Takip Uygulaması",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Navigation />
          <div className="container">
            <main role="main" className="pb-3">
              {children}
            </main>
          </div>
          <footer className="border-top footer text-muted mt-5">
            <div className="container">
              &copy; 2025 - BudgetTracker
            </div>
          </footer>
        </SessionProvider>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" async></script>
      </body>
    </html>
  );
}

