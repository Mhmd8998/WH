"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Search() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [products, setProducts] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleSearch = async () => {
    setMessage("");
    setLoading(true);
    const requestBody = { name, status };

    try {
      const res = await fetch("http://localhost:8000/api/product/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      console.log("Response Data:", data); // لمراقبة البيانات

      if (res.ok) {
        setProducts(data);        // البيانات هي مصفوفة مباشرة
        setWithdrawals([]);       // لا توجد سحوبات في هذا الرد
      } else {
        setMessage(data.message || "حدث خطأ أثناء البحث");
      }
    } catch (error) {
      setMessage(error.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4 text-primary">🔍 بحث المنتجات</h2>

      {/* نموذج البحث */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2 shadow-sm"
          placeholder="أدخل اسم المنتج"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="اسم المنتج"
        />
        <select
          className="form-select mb-2 shadow-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="الحالة"
        >
          <option value="">الكل</option>
          <option value="جديد">🟢 جديد</option>
          <option value="مستعمل">🟡 مستعمل</option>
          <option value="تالف">🔴 تالف</option>
        </select>
        <button
          onClick={handleSearch}
          className="btn btn-primary w-100 mb-3"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-search"></i>
          )}
          {loading ? "جاري البحث..." : "بحث"}
        </button>
      </div>

      {/* عرض الرسائل */}
      {message && (
        <div className={`alert alert-${message.includes("خطأ") ? "danger" : "success"}`}>
          <i className={`bi bi-${message.includes("خطأ") ? "exclamation-circle" : "check-circle"}`}></i>
          {message}
        </div>
      )}

      {/* جدول عرض المنتجات */}
      {products.length > 0 && (
        <div>
          <h4 className="text-center text-success">المنتجات</h4>
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>اسم المنتج</th>
                <th>الحالة</th>
                <th>الكمية</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.status}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
         }
