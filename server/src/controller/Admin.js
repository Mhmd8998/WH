const pool = require('../DB/db');
const asyncHandler = require("express-async-handler");

module.exports = {
  getAdminNotification: asyncHandler(async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM notifications ORDER BY created_at DESC"
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "لم يتم العثور على إشعارات." });
      }

      return res.status(200).json({
        count: result.rows.length,
        notifications: result.rows
      });

    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات." });
    }
  }),

  updateNotificationReadStatus: asyncHandler(async (req, res) => {
    const notificationId = req.params.id;
    if (!notificationId) {
      return res.status(400).json({ message: "رقم الإشعار غير موجود" });
    }

    try {
      const result = await pool.query(
        `UPDATE notifications SET isRead = 1 WHERE id = $1`,
        [notificationId]
      );

      if (result.rowCount > 0) {
        return res.status(200).json({ message: `تم تحديث حالة الإشعار ID ${notificationId} إلى مقروء.` });
      } else {
        return res.status(404).json({ message: "لم يتم العثور على الإشعار" });
      }
    } catch (error) {
      console.error("Error in updateNotificationReadStatus:", error);
      return res.status(500).json({ message: "حدث خطأ غير متوقع." });
    }
  }),
  setAdmin: asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: "معرف المستخدم غير متوفر." });
  }

  try {
    const result = await pool.query(
      "UPDATE users SET isAdmin = true WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "لم يتم العثور على المستخدم." });
    }

    return res.status(200).json({ message: "تم ترقية المستخدم إلى مسؤول بنجاح." });

  } catch (error) {
    console.error("Error in setAdmin:", error);
    return res.status(500).json({ message: "حدث خطأ أثناء ترقية المستخدم." });
  }
})
};
