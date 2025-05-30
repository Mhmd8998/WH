"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetMeAdmin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  console.log("useEffect is working");
  const ontoken = localStorage.getItem("token");
  console.log("Token from localStorage:", ontoken);

  if (ontoken) {
    setToken(ontoken);
  } else {
    // router.push("/login");  <-- علّق هذا مؤقتاً
  }
}, [router]);
  const handleClick = async () => {
    if (!token) {
      alert("الرجاء تسجيل الدخول أولاً.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/admin/setGre", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("تم ترقية المستخدم بنجاح.");
        router.push("/");
      } else {
        alert(`خطأ: ${data.message}`);
      }
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب:", error);
      alert("حدث خطأ أثناء إرسال الطلب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">إدارة الصلاحيات</h2>
      <button
        className="btn btn-success"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "جاري الترقية..." : "ترقية المستخدم إلى مسؤول"}
      </button>
    </div>
  );
        }
