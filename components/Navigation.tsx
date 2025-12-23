"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            BudgetTracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target=".navbar-collapse"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
            {session ? (
              <>
                <ul className="navbar-nav flex-grow-1">
                  <li className="nav-item">
                    <Link
                      className={`nav-link text-dark ${pathname === "/dashboard" ? "active" : ""}`}
                      href="/dashboard"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link text-dark ${pathname === "/expenses" ? "active" : ""}`}
                      href="/expenses"
                    >
                      Harcamalar
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link text-dark ${pathname === "/categories" ? "active" : ""}`}
                      href="/categories"
                    >
                      Kategoriler
                    </Link>
                  </li>
                </ul>
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <span className="navbar-text me-3">
                      Hoş geldin, {session.user?.name}!
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link text-dark border-0 p-0"
                      onClick={() => signOut({ callbackUrl: "/account/login" })}
                    >
                      Çıkış
                    </button>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark ${pathname === "/account/login" ? "active" : ""}`}
                    href="/account/login"
                  >
                    Giriş
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-dark ${pathname === "/account/register" ? "active" : ""}`}
                    href="/account/register"
                  >
                    Kayıt Ol
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

