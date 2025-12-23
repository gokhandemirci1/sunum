import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="alert alert-danger text-center" role="alert">
          <h2 className="mb-3">Erişim Reddedildi</h2>
          <p className="mb-4">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <div>
            <Link href="/dashboard" className="btn btn-primary me-2">
              Ana Sayfaya Dön
            </Link>
            <Link href="/account/login" className="btn btn-secondary">
              Giriş Sayfası
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
