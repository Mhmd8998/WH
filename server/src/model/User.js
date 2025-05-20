const pool = require("../DB/db");
const joi = require('joi');

// إنشاء الجداول باستخدام PostgreSQL
const createTables = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin BOOLEAN DEFAULT false
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      user_id INTEGER,
      isRead INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
  } catch (err) {
    console.error("Error creating tables", err);
  }
};

createTables();

const validateRegisterUser = (obj) => {
    const schema = joi.object({
      username: joi.string().trim().max(100).min(3).required(),
      password: joi.string().trim().max(100).min(8).required()
    });
    return schema.validate(obj);
};
  
const validateLoginUser = (obj) => {
    const schema = joi.object({
      username: joi.string().trim().min(3).required(),
      password: joi.string().trim().min(6).required()
    });
    return schema.validate(obj);
};

module.exports = {
    validateRegisterUser,
    validateLoginUser
};
