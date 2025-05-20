require("dotenv").config();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../DB/db");

const { validateRegisterUser, validateLoginUser } = require("../model/User");

module.exports = {
  createUser: asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    try {
      const existingUserResult = await pool.query(
        `SELECT * FROM "user" WHERE username = $1`,
        [username]
      );

      if (existingUserResult.rows.length > 0) {
        return res.status(400).json({ message: "User name Alread exist " });
      }

      const hashpass = await bcrypt.hash(password, 10);

      await pool.query(
        `INSERT INTO "user" (username, password) VALUES ($1, $2)`,
        [username, hashpass]
      );

      return res.status(200).json({ message: "User Regestered successfully" });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "database error" });
    }
  }),

  login: asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(401).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    try {
      const result = await pool.query(
        `SELECT * FROM "user" WHERE username = $1`,
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const existingUser = result.rows[0];
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: existingUser.id, isAdmin: existingUser.isadmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: "login success",
        token,
        user_id: existingUser.id
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "database error" });
    }
  })
};
