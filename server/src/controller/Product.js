const pool = require('../DB/db');
const asyncHandler = require("express-async-handler");
const { validateCreateProductSchema } = require('../model/Product');

module.exports = {
    createProduct: asyncHandler(async (req, res) => {
        const { error } = validateCreateProductSchema(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, status, quantity } = req.body;

        try {
            const existingProductResult = await pool.query(
                `SELECT * FROM product WHERE name = $1 AND status = $2`,
                [name, status]
            );
            const existingProduct = existingProductResult.rows[0];

            if (existingProduct) {
                const newQuantity = Number(existingProduct.quantity) + Number(quantity);

                await pool.query(
                    `UPDATE product SET quantity = $1 WHERE name = $2 AND status = $3`,
                    [newQuantity, name, status]
                );

                await pool.query(
                    `INSERT INTO product_log (name, status, quantity, user_id) VALUES ($1, $2, $3, $4)`,
                    [name, status, quantity, req.user.id]
                );

                const notifMessage = `تم تحديث كمية المنتج ${name} (${status}) بمقدار ${quantity}`;
                await pool.query(
                    `INSERT INTO notifications (message, user_id) VALUES ($1, $2)`,
                    [notifMessage, req.user.id]
                );

                return res.status(200).json({
                    message: "تم تحديث الكمية وحفظ السجل.",
                    product: { name, status, quantity: newQuantity }
                });
            }

            await pool.query(
                `INSERT INTO product (name, status, quantity, user_id) VALUES ($1, $2, $3, $4)`,
                [name, status, quantity, req.user.id]
            );

            await pool.query(
                `INSERT INTO product_log (name, status, quantity, user_id) VALUES ($1, $2, $3, $4)`,
                [name, status, quantity, req.user.id]
            );

            const notifMessage = `تمت إضافة منتج جديد: ${name} (${status}) بكمية ${quantity}`;
            await pool.query(
                `INSERT INTO notifications (message, user_id) VALUES ($1, $2)`,
                [notifMessage, req.user.id]
            );

            return res.status(201).json({
                message: "تمت إضافة المنتج وحفظ السجل.",
                product: { name, status, quantity }
            });

        } catch (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "حدث خطأ في قاعدة البيانات." });
        }
    }),

    allprod: asyncHandler(async (req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM product`);
            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }
    }),

    gitwithname: asyncHandler(async (req, res) => {
        const { name, status } = req.body;

        if (!name && !status) {
            return res.status(400).json({ message: "يجب إدخال الاسم أو الحالة للبحث." });
        }

        try {
            const result = await pool.query(
                `SELECT * FROM product WHERE name = $1 OR status = $2`,
                [name, status]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "لم يتم العثور على منتجات مطابقة." });
            }

            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }
    })
};
