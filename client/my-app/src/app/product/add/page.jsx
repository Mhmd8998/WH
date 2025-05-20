"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", status);
    formData.append("quantity", quantity);
    if (image) formData.append("image", image);

    const res = await fetch("http://localhost:8000/api/product/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => router.push("/"), 1000);
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
        encType="multipart/form-data"
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

        {/* رفع صورة */}
        <div className="mb-3">
          <label className="form-label fw-bold">صورة المنتج (اختياري)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* معاينة الصورة */}
        {preview && (
          <div className="text-center mb-3">
            <img
              src={preview}
              alt="معاينة المنتج"
              className="img-thumbnail"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}

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
