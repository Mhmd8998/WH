'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import war from "../../../public/war.png";
import bellIcon from "../../../public/bell2.png";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchNotifications(savedToken);
    }
  }, []);

  const fetchNotifications = async (savedToken) => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/notification', {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      const data = await response.json();
      if (response.ok) {
        const sorted = (data.notifications || []).sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sorted);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/mark-read${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <nav className="navbar bg-white shadow-sm px-3 py-2 fixed-top z-3">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-3">
            {token && (
              <button
                className="btn btn-light border rounded-circle p-2"
                onClick={() => setShowMenu(true)}
              >
                <span style={{ fontSize: '18px' }}>☰</span>
              </button>
            )}

            <div className="d-flex align-items-center">
              <Image src={war} width={30} height={30} alt="logo" />
              <span className="ms-2 fw-bold text-warning fs-5">المستودع</span>
            </div>
          </div>

          {token && (
            <div className="position-relative">
              <button
                type="button"
                onClick={() => setShowNotifications(true)}
                className="btn btn-light border rounded-circle p-2 position-relative"
              >
                <Image src={bellIcon} alt="Notifications" width={25} height={25} />
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* نافذة الإشعارات */}
      {showNotifications && token && (
        <div
          className="position-fixed bg-white border rounded shadow p-4"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1050,
            width: '90%',
            maxWidth: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          <div className="text-end">
            <button className="btn btn-sm btn-outline-danger mb-2" onClick={() => setShowNotifications(false)}>
              إغلاق
            </button>
            <h5 className="mb-3">الإشعارات</h5>
            <hr />
            {notifications.length > 0 ? (
              notifications.map(note => (
                <div key={note.id} className="mb-3 text-end border-bottom pb-2">
                  <div>{note.message}</div>
                  <small className="text-muted d-block">{new Date(note.created_at).toLocaleString()}</small>

                  {!note.isRead && (
                    <button
                      className="btn btn-sm btn-outline-primary mt-1"
                      onClick={() => markAsRead(note._id)}
                    >
                      تعيين كمقروء
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-muted">لا إشعارات</div>
            )}
          </div>
        </div>
      )}

      {/* نافذة القائمة */}
      {showMenu && token && (
        <div
          className="position-fixed bg-white border rounded shadow p-4"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1050,
            width: '90%',
            maxWidth: '400px'
          }}
        >
          <div className="text-end">
            <button className="btn btn-sm btn-outline-danger mb-2" onClick={() => setShowMenu(false)}>
              إغلاق
            </button>
            <h5 className="mb-3">القائمة</h5>
            <hr />
            <ul className="list-unstyled text-end">
              <li><a href="/product/add" className="text-decoration-none text-dark"> إدخال</a></li>
              <li><a href="/product/withdraw" className="text-decoration-none text-dark"> إخراج</a></li>
              <li><a href="/weeklyreport" className="text-decoration-none text-dark"> تقرير</a></li>
              <li><a href="/product/search" className="text-decoration-none text-dark"> البحث</a></li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline-danger w-100 mt-3">
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
        }
