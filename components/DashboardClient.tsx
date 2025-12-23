"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface DashboardStats {
  weeklyTotal: number;
  monthlyTotal: number;
  sixMonthsTotal: number;
  byCategory: Record<string, number>;
}

export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    weeklyTotal: 0,
    monthlyTotal: 0,
    sixMonthsTotal: 0,
    byCategory: {},
  });
  const [weeklyByCategory, setWeeklyByCategory] = useState<Record<string, number>>({});
  const [monthlyByCategory, setMonthlyByCategory] = useState<Record<string, number>>({});
  const [sixMonthsByCategory, setSixMonthsByCategory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [weeklyRes, monthlyRes, sixMonthsRes] = await Promise.all([
        fetch("/api/dashboard/stats?period=weekly"),
        fetch("/api/dashboard/stats?period=monthly"),
        fetch("/api/dashboard/stats?period=sixmonths"),
      ]);

      if (!weeklyRes.ok || !monthlyRes.ok || !sixMonthsRes.ok) {
        console.error("API error:", { weeklyRes, monthlyRes, sixMonthsRes });
        setLoading(false);
        return;
      }

      const [weekly, monthly, sixMonths] = await Promise.all([
        weeklyRes.json(),
        monthlyRes.json(),
        sixMonthsRes.json(),
      ]);

      setStats({
        weeklyTotal: weekly.weeklyTotal,
        monthlyTotal: monthly.monthlyTotal,
        sixMonthsTotal: sixMonths.sixMonthsTotal,
        byCategory: {},
      });
      setWeeklyByCategory(weekly.byCategory);
      setMonthlyByCategory(monthly.byCategory);
      setSixMonthsByCategory(sixMonths.byCategory);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const weeklyData = {
    labels: Object.keys(weeklyByCategory),
    datasets: [
      {
        label: "Tutar (₺)",
        data: Object.values(weeklyByCategory),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const monthlyData = {
    labels: Object.keys(monthlyByCategory),
    datasets: [
      {
        label: "Tutar (₺)",
        data: Object.values(monthlyByCategory),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const sixMonthsData = {
    labels: Object.keys(sixMonthsByCategory),
    datasets: [
      {
        label: "Tutar (₺)",
        data: Object.values(sixMonthsByCategory),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="text-center p-5">Yükleniyor...</div>;
  }

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Dashboard</h1>

      {/* Özet Kartlar */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Haftalık Toplam</h5>
              <h2 className="card-text">{formatCurrency(stats.weeklyTotal)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Aylık Toplam</h5>
              <h2 className="card-text">{formatCurrency(stats.monthlyTotal)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">6 Aylık Toplam</h5>
              <h2 className="card-text">{formatCurrency(stats.sixMonthsTotal)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Haftalık Harcamalar (Kategori Bazında)</h5>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
              {Object.keys(weeklyByCategory).length > 0 ? (
                <Bar data={weeklyData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center">Veri bulunamadı</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Aylık Harcamalar (Kategori Bazında)</h5>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
              {Object.keys(monthlyByCategory).length > 0 ? (
                <Bar data={monthlyData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center">Veri bulunamadı</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>6 Aylık Harcamalar (Kategori Bazında)</h5>
            </div>
            <div className="card-body" style={{ height: "300px" }}>
              {Object.keys(sixMonthsByCategory).length > 0 ? (
                <Line data={sixMonthsData} options={chartOptions} />
              ) : (
                <p className="text-muted text-center">Veri bulunamadı</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

