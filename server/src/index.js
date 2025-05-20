require("dotenv").config();
const { createTables: createUserTable } = require('./model/User');
const { createTables: createProductTable } = require('./model/Product');
const { createTable: createWithdrawalTable } = require('./model/Withdrawl');

(async () => {
  try {
    await createUserTable();
    console.log('User table created');

    await createProductTable();
    console.log('Product table created');

    await createWithdrawalTable();
    console.log('Product withdrawal table created');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
})();

const express = require("express");
const app = express();
const cors = require("cors");

const Auth = require("./router/Auth");
const Product = require("./router/Product");
const Withdrawl = require("./router/Withdrawl");
const Admin = require("./router/Admin");
const WeeklyReport = require("./router/WeeklyReport");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/api/auth", Auth);
app.use("/api/product", Product);
app.use("/api/withdrawl", Withdrawl);
app.use("/api/admin", Admin);
app.use("/api", WeeklyReport);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
