const pool = require("../DB/db");
const joi = require("joi");

// إنشاء جدول product_withdrawal
const createTable = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS product_withdrawal (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      recipient TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      note TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
    console.log("Table product_withdrawal created successfully.");
  } catch (err) {
    console.error("Error creating product_withdrawal table:", err);
  }
};

// التحقق من صحة البيانات المسحوبة
const validateCreateWithdrawl = (obj) => {
  const productSchema = joi.object({
    product_name: joi.string().trim().max(100).min(3).required(),
    note: joi.string().trim().max(200).min(3),
    status: joi.string().trim().max(50).min(3).required(),
    recipient: joi.string().trim().max(50).min(3).required(),
    quantity: joi.number().integer().min(1).required()
  });

  const schema = joi.object({
    products: joi.array().items(productSchema).min(1).required()
  });

  return schema.validate(obj);
};

// تصدير الدوال
module.exports = { createTable, validateCreateWithdrawl };
