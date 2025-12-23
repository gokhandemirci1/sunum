import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Sayfa Bulunamadı</h2>
          <p className="mb-4">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link href="/dashboard" className="btn btn-primary me-2">
            Ana Sayfaya Dön
          </Link>
          <Link href="/account/login" className="btn btn-secondary">
            Giriş Sayfası
          </Link>
        </div>
      </div>
    </div>
  );
}

