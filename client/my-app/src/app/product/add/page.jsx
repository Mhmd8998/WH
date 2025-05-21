"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("اسم المنتج مطلوب ولا يمكن أن يكون فارغًا.");
      return;
    }

    const body = {
      name: name.trim(),
      status,
      quantity,
    };

    try {
      const res = await fetch("http://localhost:8000/api/product/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setMessage(data.message || "تمت العملية");

      if (res.ok) {
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("حدث خطأ أثناء إضافة المنتج.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      dir="rtl"
    >
      <form
        onSubmit={handleAddProduct}
        className="bg-white shadow rounded p-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          ➕ إضافة منتج جديد
        </h3>

        {/* اسم المنتج */}
        <div className="mb-3">
          <label className="form-label fw-bold">اسم المنتج</label>
          <div className="input-group">
            <span className="input-group-text">📦</span>
            <input
              type="text"
              className="form-control"
              placeholder="مثال: طابعة"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* الحالة */}
        <div className="mb-3">
          <label className="form-label fw-bold">حالة المنتج</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">-- اختر الحالة --</option>
            <option value="جديد">🟢 جديد</option>
            <option value="مستعمل">🟡 مستعمل</option>
            <option value="تالف">🔴 تالف</option>
          </select>
        </div>

        {/* الكمية */}
        <div className="mb-3">
          <label className="form-label fw-bold">الكمية</label>
          <div className="input-group">
            <span className="input-group-text">🔢</span>
            <input
              type="number"
              className="form-control"
              placeholder="أدخل الكمية"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min={1}
            />
          </div>
        </div>

        {/* زر الإرسال */}
        <button type="submit" className="btn btn-success w-100 fw-bold">
          ✅ إضافة المنتج
        </button>

        {/* الرسالة */}
        {message && (
          <div className="alert alert-info text-center mt-3">{message}</div>
        )}
      </form>
    </div>
  );
        }
