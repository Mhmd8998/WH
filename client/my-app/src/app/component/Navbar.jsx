'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import war from "../../../public/war.png";
import bellIcon from "../../../public/bell2.png";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    setToken(savedToken);

    if (!savedToken) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/notification', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setNotifications(data.notifications || []);
        } else {
          console.log("⚠️ خطأ في الاستجابة:", data.message);
        }
      } catch (error) {
        console.log("❌ فشل الاتصال بالسيرفر:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/mark-read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((note) =>
            note.id === notificationId ? { ...note, isRead: true } : note
          )
        );
      } else {
        console.log("⚠️ خطأ في تحديث الإشعار:", data.message);
      }
    } catch (error) {
      console.log("❌ فشل الاتصال بتحديث الإشعار:", error);
    }
  };

  const handleLogout = () => {
    localStorage.setItem('token', "");
    localStorage.setItem('user_id', "");
    setToken(null);
    window.location.reload();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid px-3">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <Image src={war} width={30} alt="logo" />
          <span className="ms-2">المستودع</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarContent">
          {token && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="/product/add">الإدخال</a></li>
              <li className="nav-item"><a className="nav-link" href="/product/withdraw">الإخراج</a></li>
              <li className="nav-item"><a className="nav-link" href="#scrollspyHeading2">المخزن</a></li>
              <li className="nav-item"><a className="nav-link" href="/weeklyreport">التقرير</a></li>
              <li className="nav-item"><a className="nav-link" href="/product/search">البحث</a></li>
            </ul>
          )}

          <ul className="navbar-nav align-items-center ms-auto">
            {token && (
              <>
                <li className="nav-item position-relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="btn position-relative"
                    style={{ background: "none", border: "none" }}
                  >
                    <Image src={bellIcon} alt="Notifications" width={25} height={25} />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div
                      className="position-absolute notification-box shadow bg-white rounded p-3 border"
                      style={{ top: '45px', right: '0', width: '320px', zIndex: 999 }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          right: "20px",
                          width: "0",
                          height: "0",
                          borderLeft: "10px solid transparent",
                          borderRight: "10px solid transparent",
                          borderBottom: "10px solid white"
                        }}
                      ></div>

                      <h6 className="fw-bold border-bottom pb-2 mb-3 text-end">🔔 الإشعارات</h6>

                      <ul className="list-unstyled m-0" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {notifications.length > 0 ? (
                          notifications.map((note) => (
                            <li
                              key={note.id}
                              className="mb-3 d-flex gap-2 align-items-start border-start border-4 ps-3"
                              style={{
                                borderColor: note.isRead ? "#ced4da" : "#0d6efd",
                                backgroundColor: note.isRead ? "#f8f9fa" : "#f1f8ff",
                                borderRadius: '6px',
                                padding: '8px'
                              }}
                            >
                              <span style={{ fontSize: '18px' }}>📢</span>
                              <div className="flex-grow-1 text-end">
                                <div className="fw-semibold text-dark">{note.message}</div>
                                <small className="text-muted mt-1 d-block">{new Date(note.created_at).toLocaleString()}</small>
                              </div>
                              {!note.isRead && (
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => markAsRead(note.id)}
                                >
                                  مقروء
                                </button>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-muted text-center">لا توجد إشعارات حالياً</li>
                        )}
                      </ul>
                    </div>
                  )}
                </li>

                <li className="nav-item">
                  <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>تسجيل الخروج</button>
                </li>
              </>
            )}

            {!token && (
              <>
                <li className="nav-item"><a className="nav-link" href="/register">تسجيل</a></li>
                <li className="nav-item"><a className="nav-link" href="/login">تسجيل دخول</a></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
                    }
