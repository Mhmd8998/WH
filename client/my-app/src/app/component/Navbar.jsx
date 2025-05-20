'use client';
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import war from "../../../public/war.png";
import bellIcon from "../../../public/bell2.png";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const boxRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar bg-white shadow-sm px-3 py-2 fixed-top z-3">
      <div className="d-flex justify-content-between w-100 align-items-center">
        {/* الشعار */}
        <div className="d-flex align-items-center">
          <Image src={war} width={30} height={30} alt="logo" />
          <span className="ms-2 fw-bold text-warning fs-5">المستودع</span>
        </div>

        {/* الإشعارات */}
        <div className="d-flex align-items-center position-relative" ref={boxRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-light border rounded-circle p-2 position-relative"
            style={{ transition: '0.2s' }}
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
              className="position-absolute bg-white border rounded shadow p-3"
              style={{
                top: '45px',
                right: 0,
                minWidth: '260px',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 999
              }}
            >
              <h6 className="text-end">الإشعارات</h6>
              <hr />
              {notifications.length > 0 ? (
                notifications.map(note => (
                  <div key={note.id} className="mb-2 text-end">
                    <div>{note.message}</div>
                    <small className="text-muted">{new Date(note.created_at).toLocaleString()}</small>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted">لا إشعارات</div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
