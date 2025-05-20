const pool = require("../DB/db");
const joi = require("joi");

// إنشاء جدول product و product_log فقط
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL,
        note TEXT,
        quantity INTEGER NOT NULL,
        user_id INTEGER,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES "users"(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_log (
        id SERIAL PRIMARY KEY,
        name TEXT,
        status TEXT,
        note TEXT,
        quantity INTEGER,
        user_id INTEGER,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error("Error creating tables", err);
  }
};

createTables();

// التحقق من البيانات عند إنشاء منتج
const validateCreateProductSchema = (obj) => {
  const schema = joi.object({
    name: joi.string().trim().max(100).min(3).required(),
    status: joi.string().trim().max(40).min(3).required(),
    quantity: joi.number().integer().min(1).required(),
  });

  return schema.validate(obj);
};

module.exports = { validateCreateProductSchema };
