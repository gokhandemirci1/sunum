"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Expense {
  id: number;
  amount: number;
  description: string;
  expenseDate: string;
  category: {
    id: number;
    name: string;
    color: string;
  };
}

export default function ExpensesClient() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu harcamayı silmek istediğinizden emin misiniz?")) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExpenses(expenses.filter((e) => e.id !== id));
      } else {
        alert("Silme işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Bir hata oluştu.");
    } finally {
      setDeleting(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  if (loading) {
    return <div className="text-center p-5">Yükleniyor...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Harcamalar</h1>
        <Link href="/expenses/create" className="btn btn-primary">
          Yeni Harcama Ekle
        </Link>
      </div>

      {expenses.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Kategori</th>
                <th>Açıklama</th>
                <th>Tutar</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{formatDate(expense.expenseDate)}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ backgroundColor: expense.category.color }}
                    >
                      {expense.category.name}
                    </span>
                  </td>
                  <td>{expense.description}</td>
                  <td>
                    <strong>{formatCurrency(Number(expense.amount))}</strong>
                  </td>
                  <td>
                    <Link
                      href={`/expenses/edit/${expense.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Düzenle
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleting === expense.id}
                    >
                      {deleting === expense.id ? "Siliniyor..." : "Sil"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-info">
                <td colSpan={3}>
                  <strong>Toplam</strong>
                </td>
                <td>
                  <strong>{formatCurrency(total)}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          <p>
            Henüz harcama kaydınız bulunmamaktadır.{" "}
            <Link href="/expenses/create">İlk harcamanızı ekleyin</Link>.
          </p>
        </div>
      )}
    </div>
  );
}

