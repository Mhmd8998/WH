"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // استيراد FontAwesomeIcon
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';  // استيراد الأيقونات

export default function Withdraw() {
  const [products, setProducts] = useState([
    { product_name: "", quantity: 1, note: "", status: "جديد", recipient: "" },
  ]);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const statusOptions = ["جديد", "مستعمل", "تالف"];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    if (!token) router.push("/login");
  }, []);

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;

    setProducts(updatedProducts);
  };

  const addProduct = () => {
    const firstProduct = products[0];
    setProducts([
      ...products,
      {
        product_name: "",
        quantity: 1,
        note: firstProduct.note, // نسخ الملاحظة من المنتج الأول
        status: "جديد", // تعيين الحالة الافتراضية
        recipient: firstProduct.recipient, // نسخ المستلم من المنتج الأول
      },
    ]);
  };

  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // تنظيف الرسالة السابقة

    if (!token) {
      setMessage("يرجى تسجيل الدخول أولاً");
      return;
    }

    // التحقق من الحقول المطلوبة
    for (let product of products) {
      if (!product.product_name || !product.recipient || product.quantity <= 0) {
        setMessage("يجب ملء جميع الحقول بشكل صحيح.");
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:8000/api/withdrawl/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "تم السحب بنجاح");
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.message || "فشل في العملية");
      }
    } catch (error) {
      setMessage(error.message || "حدث خطأ في الاتصال بالسيرفر");
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4 text-primary">📦 سحب منتجات</h2>

      <form onSubmit={handleSubmit}>
        {products.map((product, index) => (
          <div className="card mb-3 shadow-lg rounded" key={index}>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    value={product.product_name}
                    placeholder="اسم المنتج"
                    onChange={(e) => handleProductChange(index, "product_name", e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control shadow-sm"
                    value={product.quantity}
                    min={1}
                    placeholder="الكمية"
                    onChange={(e) =>
                      handleProductChange(index, "quantity", parseInt(e.target.value))
                    }
                    required
                  />
                </div>

                {/* عرض حقل الحالة فقط في المنتج الأول */}
                {index === 0 && (
                  <div className="col-md-4">
                    <select
                      className="form-select shadow-sm"
                      value={product.status}
                      onChange={(e) => handleProductChange(index, "status", e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* عرض الحقول الأخرى فقط في المنتج الأول */}
              {index === 0 && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        value={product.note}
                        placeholder="الملاحظة"
                        onChange={(e) => handleProductChange(index, "note", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control shadow-sm"
                        value={product.recipient}
                        placeholder="المستلم"
                        onChange={(e) => handleProductChange(index, "recipient", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn-danger shadow-sm"
                onClick={() => removeProduct(index)}
              >
                <FontAwesomeIcon icon={faTrashAlt} /> {/* أيقونة الحذف */}
              </button>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-secondary shadow-sm me-2" onClick={addProduct}>
            <FontAwesomeIcon icon={faPlus} /> {/* أيقونة إضافة منتج */}
          </button>
          <button type="submit" className="btn btn-success shadow-sm">
            🛒 سحب المنتجات
          </button>
        </div>
      </form>

      {message && (
        <div className={`alert alert-${message.includes("فشل") ? "danger" : "info"} text-center fadeIn`} role="alert">
          {message}
        </div>
      )}
    </div>
  );
}
