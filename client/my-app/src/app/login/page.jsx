"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      setMessage(data.message);
      setTimeout(() => router.push("/"), 1000);
    } else {
      setMessage(data.message || 'فشل تسجيل الدخول');
    }
  };

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`} dir="rtl">
      <form
        onSubmit={handleLogin}
        className={`card shadow p-4 ${darkMode ? 'bg-secondary' : 'bg-white'}`}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        {/* شعار وأزرار */}
        <div className="text-center mb-4">
          <img src="/logo.png" alt="Logo" style={{ width: '60px', marginBottom: '10px' }} />
          <h3 className="text-primary">تسجيل الدخول</h3>
          <button
            type="button"
            onClick={toggleTheme}
            className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'} mt-2`}
          >
            {darkMode ? 'وضع النهار ☀️' : 'الوضع الليلي 🌙'}
          </button>
        </div>

        {/* الحقول */}
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

        <div className="mb-3">
          <label className="form-label">كلمة المرور</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••"
          />
        </div>

        {/* زر الدخول */}
        <button type="submit" className="btn btn-primary w-100">تسجيل الدخول</button>

        {/* رسالة الخطأ أو النجاح */}
        {message && <div className="mt-3 alert alert-info text-center">{message}</div>}

        {/* رابط التسجيل */}
        <p className="text-center mt-3">
          لا تملك حساباً؟ <a href="/register" className="text-decoration-none">إنشاء حساب جديد</a>
        </p>
      </form>
    </div>
  );
}
