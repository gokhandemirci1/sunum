"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h2 className="mb-4">Bir hata oluştu!</h2>
          <p className="mb-4">{error.message || "Beklenmeyen bir hata oluştu."}</p>
          <button onClick={reset} className="btn btn-primary me-2">
            Tekrar Dene
          </button>
          <Link href="/dashboard" className="btn btn-secondary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

