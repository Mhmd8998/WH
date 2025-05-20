"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SetMeAdmin() {
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    if (!token) router.push("/login");
  }, []);
  
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/setGre', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        }
        // body: JSON.stringify({ id: 123 }), // إذا كان هناك بيانات تُرسل
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // "تم ترقية المستخدم إلى مسؤول بنجاح."
      } else {
        alert(`خطأ: ${data.message}`);
      }
    } catch (error) {
      alert('حدث خطأ أثناء إرسال الطلب.');
      console.error(error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <button className="btn btn-success" onClick={handleClick}>
        ترقية المستخدم إلى مسؤول
      </button>
    </div>
  );
}
