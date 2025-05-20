const db = require('../DB/db'); // هذا يجب أن يكون pg Pool
const asyncHandler = require("express-async-handler");
const { validateCreateWithdrawl } = require('../model/Withdrawl');

module.exports = {
  createWithdrawal: asyncHandler(async (req, res) => {
    const { error } = validateCreateWithdrawl(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products list is required and must not be empty." });
    }

    try {
      const withdrawnProducts = [];

      for (const item of products) {
        const { product_name, status, recipient, quantity, note } = item;

        const { rows: productRows } = await db.query(
          "SELECT * FROM product WHERE name = $1 AND status = $2",
          [product_name, status]
        );
        const product = productRows[0];

        if (!product) {
          return res.status(404).json({ message: `المنتج غير موجود: ${product_name}` });
        }

        if (product.quantity < quantity) {
          return res.status(400).json({ message: `الكمية المطلوبة أكبر من الكمية المتاحة للمنتج: ${product_name}` });
        }

        const newQuantity = product.quantity - quantity;

        await db.query(
          "UPDATE product SET quantity = $1 WHERE id = $2",
          [newQuantity, product.id]
        );

        await db.query(
          "INSERT INTO product_withdrawal (product_id, status, quantity, recipient, user_id, note) VALUES ($1, $2, $3, $4, $5, $6)",
          [product.id, status, quantity, recipient, req.user.id, note || "لا يوجد"]
        );

        const notifMessage = `تم سحب ${quantity} من المنتج ${product_name} (${status}) إلى المستلم ${recipient}`;
        await db.query(
          "INSERT INTO notifications (message, user_id) VALUES ($1, $2)",
          [notifMessage, req.user.id]
        );

        if (newQuantity < 3) {
          const lowStockMessage = `المنتج ${product_name} (${status}) أوشك على النفاد. الكمية الحالية: ${newQuantity}`;
          await db.query(
            "INSERT INTO notifications (message, user_id) VALUES ($1, $2)",
            [lowStockMessage, req.user.id]
          );
        }

        withdrawnProducts.push({
          name: product_name,
          status,
          quantity,
          recipient,
          note: note || "لا يوجد"
        });
      }

      return res.status(201).json({
        message: "تمت إضافة السحب بنجاح.",
        withdrawals: withdrawnProducts
      });

    } catch (error) {
      console.error("خطأ في قاعدة البيانات:", error);
      return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات" });
    }
  }),

  gitWitdraw: asyncHandler(async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM product_withdrawal");
      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: "خطأ في قاعدة البيانات", error: err.message });
    }
  }),

  gitwithname: asyncHandler(async (req, res) => {
    const { name, status } = req.body;

    if (!name && !status) {
      return res.status(400).json({ message: "يجب إدخال الاسم أو الحالة للبحث." });
    }

    try {
      const { rows } = await db.query(
        `SELECT pw.*, p.name 
         FROM product_withdrawal pw
         JOIN product p ON pw.product_id = p.id
         WHERE p.name = $1 OR pw.status = $2`,
        [name, status]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "لم يتم العثور على منتجات مطابقة." });
      }

      return res.status(200).json(rows);
    } catch (err) {
      return res.status(500).json({ message: "خطأ في قاعدة البيانات", error: err.message });
    }
  }),
  filterWithdrawalsByDate: asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: "يرجى تحديد تاريخ البداية والنهاية (from و to)." });
  }

  try {
    const query = `
      SELECT pw.*, p.name 
      FROM product_withdrawal pw
      JOIN product p ON pw.product_id = p.id
      WHERE DATE(pw.timestamp) BETWEEN $1 AND $2
      ORDER BY pw.timestamp DESC
    `;

    const { rows } = await db.query(query, [from, to]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "لا توجد سحوبات ضمن الفترة المحددة." });
    }

    return res.status(200).json({
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("خطأ أثناء فلترة السحوبات:", error);
    return res.status(500).json({ message: "خطأ في قاعدة البيانات." });
  }
}),
exportWithdrawalReport: asyncHandler(async (req, res) => {
  try {
    const query = `
      SELECT pw.*, p.name 
      FROM product_withdrawal pw
      JOIN product p ON pw.product_id = p.id
      ORDER BY pw.timestamp DESC
    `;

    const { rows } = await db.query(query);

    const fileName = `withdrawal_report_${Date.now()}.json`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/json');

    return res.send(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error("خطأ في تصدير التقرير:", error);
    return res.status(500).json({ message: "فشل في تصدير التقرير." });
  }
})
};
