const pool = require("../DB/db");

// استعلام المدخلات خلال الفترة بين start و end
async function getWeeklyProductInputs(start, end, callback) {
  const query = `
    SELECT * FROM product_log
    WHERE timestamp BETWEEN $1 AND $2
    ORDER BY timestamp DESC
  `;
  try {
    const result = await pool.query(query, [start, end]);
    callback(null, result.rows);
  } catch (err) {
    callback(err);
  }
}

// استعلام السحوبات خلال الفترة بين start و end
async function getWeeklyWithdrawals(start, end, callback) {
  const query = `
    SELECT * FROM product_withdrawal
    WHERE timestamp BETWEEN $1 AND $2
    ORDER BY timestamp DESC
  `;
  try {
    const result = await pool.query(query, [start, end]);
    callback(null, result.rows);
  } catch (err) {
    callback(err);
  }
}

// تجميع الكميات حسب اسم المنتج من جدول المدخلات خلال الفترة بين start و end
async function getTotalInputByProduct(start, end, callback) {
  const query = `
    SELECT name, SUM(quantity) as total_quantity
    FROM product_log
    WHERE timestamp BETWEEN $1 AND $2
    GROUP BY name
  `;
  try {
    const result = await pool.query(query, [start, end]);
    callback(null, result.rows);
  } catch (err) {
    callback(err);
  }
}

// تجميع الكميات حسب اسم المنتج من جدول السحوبات خلال الفترة بين start و end
async function getTotalWithdrawalByProduct(start, end, callback) {
  const query = `
    SELECT p.name, SUM(w.quantity) as total_quantity
    FROM product_withdrawal w
    JOIN product p ON p.id = w.product_id
    WHERE w.timestamp BETWEEN $1 AND $2
    GROUP BY p.name
  `;
  try {
    const result = await pool.query(query, [start, end]);
    callback(null, result.rows);
  } catch (err) {
    callback(err);
  }
}

module.exports = {
  getWeeklyProductInputs,
  getWeeklyWithdrawals,
  getTotalInputByProduct,
  getTotalWithdrawalByProduct
};
