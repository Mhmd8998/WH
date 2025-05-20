const router = require("express").Router();
const con = require("../controller/Withdrawl");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/", verifyToken, con.createWithdrawal);
router.get("/", verifyToken, con.gitWitdraw);
router.post("/search", verifyToken, con.gitwithname);
router.get('/withdraw/filter', verifyToken, con.filterWithdrawalsByDate);
router.get('/withdraw/export', verifyToken, con.exportWithdrawalReport);

module.exports = router;
