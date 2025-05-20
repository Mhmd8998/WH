"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ كلمتا المرور غير متطابقتين.");
      return;
    }

    const res = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => router.push("/login"), 1000);
    }
  };

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const evaluateStrength = (value) => {
    setPassword(value);
    if (value.length < 6) {
      setPasswordStrength("ضعيفة");
    } else if (/[A-Z]/.test(value) && /\d/.test(value) && value.length >= 8) {
      setPasswordStrength("قوية");
    } else {
      setPasswordStrength("متوسطة");
    }
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center vh-100 ${
        darkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}
      dir="rtl"
    >
      <form
        onSubmit={handleSubmit}
        className={`card shadow p-4 ${darkMode ? "bg-secondary" : "bg-white"}`}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        {/* العنوان وزر الوضع */}
        <div className="text-center mb-4">
          <h3 className="text-primary">📝 إنشاء حساب جديد</h3>
          <button
            type="button"
            onClick={toggleTheme}
            className={`btn btn-sm ${darkMode ? "btn-light" : "btn-dark"} mt-2`}
          >
            {darkMode ? "وضع النهار ☀️" : "الوضع الليلي 🌙"}
          </button>
        </div>

        {/* اسم المستخدم */}
        <div className="mb-3">
          <label className="form-label">اسم المستخدم</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="أدخل اسم المستخدم"
          />
        </div>

        {/* كلمة المرور */}
        <div className="mb-3">
          <label className="form-label">كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => evaluateStrength(e.target.value)}
            required
            placeholder="••••••••"
          />
          <small>
            قوة كلمة المرور:{" "}
            <span
              className={
                passwordStrength === "قوية"
                  ? "text-success"
                  : passwordStrength === "متوسطة"
                  ? "text-warning"
                  : "text-danger"
              }
            >
              {passwordStrength}
            </span>
          </small>
        </div>

        {/* تأكيد كلمة المرور */}
        <div className="mb-3">
          <label className="form-label">تأكيد كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="أعد إدخال كلمة المرور"
          />
        </div>

        {/* زر إنشاء الحساب */}
        <button type="submit" className="btn btn-success w-100">
          إنشاء الحساب
        </button>

        {/* الرسالة */}
        {message && (
          <div className="mt-3 alert alert-info text-center">{message}</div>
        )}

        {/* رابط تسجيل الدخول */}
        <p className="text-center mt-3">
          لديك حساب؟{" "}
          <a href="/login" className="text-decoration-none">
            تسجيل الدخول
          </a>
        </p>
      </form>
    </div>
  );
}
