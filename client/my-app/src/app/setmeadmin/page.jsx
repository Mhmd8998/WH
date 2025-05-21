"use client";
import { useEffect ,useState} from "react";
import { useRouter } from "next/navigation";

export default function SetMeAdmin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  useEffect(() => {
    const ontoken = localStorage.getItem("token");
    
    if (ontoken) {
      setToken(ontoken)
    }else{
      router.push("/login");
    }
  }, []);

  const handleClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("الرجاء تسجيل الدخول أولاً.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/setGre", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(`خطأ: ${data.message}`);
      }
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الطلب.");
      console.error(error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">إدارة الصلاحيات</h2>
      <button className="btn btn-success" onClick={handleClick}>
        ترقية المستخدم إلى مسؤول
      </button>
    </div>
  );
}
