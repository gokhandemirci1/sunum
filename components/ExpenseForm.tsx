"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  color: string;
}

interface Expense {
  id: number;
  amount: number;
  description: string;
  expenseDate: string;
  categoryId: number;
}

export default function ExpenseForm({ expenseId }: { expenseId?: number }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!expenseId);

  useEffect(() => {
    loadCategories();

    if (expenseId) {
      loadExpense();
    }
  }, [expenseId]);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadExpense = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const expenses = await response.json();
        const expense = expenses.find((e: Expense) => e.id === expenseId);
        if (expense) {
          setAmount(expense.amount.toString());
          setDescription(expense.description);
          setExpenseDate(new Date(expense.expenseDate).toISOString().split("T")[0]);
          setCategoryId(expense.categoryId.toString());
        }
      }
    } catch (error) {
      console.error("Error loading expense:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Tutar 0'dan büyük olmalıdır.");
      return;
    }

    if (!description.trim()) {
      setError("Açıklama gereklidir.");
      return;
    }

    if (!categoryId) {
      setError("Kategori seçmelisiniz.");
      return;
    }

    setLoading(true);

    try {
      const url = expenseId
        ? `/api/expenses/${expenseId}`
        : "/api/expenses";
      const method = expenseId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description.trim(),
          expenseDate,
          categoryId: parseInt(categoryId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Bir hata oluştu.");
        return;
      }

      router.push("/expenses");
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
          {expenseId ? "Harcama Düzenle" : "Yeni Harcama Ekle"}
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Tutar
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-control"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Açıklama
            </label>
            <textarea
              className="form-control"
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="expenseDate" className="form-label">
              Tarih
            </label>
            <input
              type="date"
              className="form-control"
              id="expenseDate"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
            <small className="form-text text-muted">
              Geçmiş veya gelecek tarih seçebilirsiniz.
            </small>
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">
              Kategori
            </label>
            <select
              className="form-select"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Kategori Seçin</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <small className="form-text text-muted">
              Kategori yok mu?{" "}
              <Link href="/categories/create">Yeni kategori oluştur</Link>
            </small>
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <Link href="/expenses" className="btn btn-secondary">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

