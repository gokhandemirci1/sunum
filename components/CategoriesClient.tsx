"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  description: string | null;
  color: string;
}

export default function CategoriesClient() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Bir hata oluştu.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Yükleniyor...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Kategoriler</h1>
        <Link href="/categories/create" className="btn btn-primary">
          Yeni Kategori Ekle
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title">
                        <span
                          className="badge me-2"
                          style={{
                            backgroundColor: category.color,
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                            borderRadius: "50%",
                          }}
                        ></span>
                        {category.name}
                      </h5>
                      {category.description && (
                        <p className="card-text text-muted">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/categories/edit/${category.id}`}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Düzenle
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <p>
            Henüz kategori kaydınız bulunmamaktadır.{" "}
            <Link href="/categories/create">İlk kategorinizi oluşturun</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

