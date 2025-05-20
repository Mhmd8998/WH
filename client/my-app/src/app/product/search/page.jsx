"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
    if (storedToken) setToken(storedToken);
    if (!token) router.push("/login");
  }, []);

  const handleSearch = async () => {
    setMessage(""); // مسح الرسائل السابقة
    setLoading(true); // تفعيل حالة التحميل
    const requestBody = { name, status };
    try {
      // البحث في المنتجات
      const res = await fetch("http://localhost:8000/api/product/search/", {
        method: "POST", // تأكد أن الطريقة هي POST أو GET
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody), // إرسال البيانات في الجسم (body)
      });

      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []); // assuming response contains products
        setWithdrawals(data.withdrawals || []); // assuming response contains withdrawals
      } else {
        setMessage(data.message || "حدث خطأ أثناء البحث");
      }
    } catch (error) {
      setMessage(error.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false); // إنهاء حالة التحميل
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4 text-primary">🔍 بحث المنتجات والسحوبات</h2>

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
          disabled={loading} // تعطيل الزر أثناء التحميل
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

      {/* جدول عرض السحوبات */}
      {withdrawals.length > 0 && (
        <div className="mt-4">
          <h4 className="text-center text-danger">السحوبات</h4>
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>اسم المنتج</th>
                <th>الحالة</th>
                <th>الكمية</th>
                <th>الملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal, index) => (
                <tr key={index}>
                  <td>{withdrawal.product_name}</td>
                  <td>{withdrawal.status}</td>
                  <td>{withdrawal.quantity}</td>
                  <td>{withdrawal.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
