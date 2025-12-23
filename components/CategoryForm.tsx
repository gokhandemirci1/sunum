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

export default function CategoryForm({ categoryId }: { categoryId?: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#007bff");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!categoryId);

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const categories = await response.json();
        const category = categories.find((c: Category) => c.id === categoryId);
        if (category) {
          setName(category.name);
          setDescription(category.description || "");
          setColor(category.color);
        }
      }
    } catch (error) {
      console.error("Error loading category:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Kategori adı gereklidir.");
      return;
    }

    setLoading(true);

    try {
      const url = categoryId
        ? `/api/categories/${categoryId}`
        : "/api/categories";
      const method = categoryId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Bir hata oluştu.");
        return;
      }

      router.push("/categories");
      router.refresh();
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div className="text-center p-5">Yükleniyor...</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">
          {categoryId ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Kategori Adı
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              className="form-control"
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="color" className="form-label">
              Renk
            </label>
            <input
              type="color"
              className="form-control form-control-color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              title="Kategori rengi seçin"
            />
            <small className="form-text text-muted">
              Kategoriyi görsel olarak ayırt etmek için renk seçin.
            </small>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <Link href="/categories" className="btn btn-secondary">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

