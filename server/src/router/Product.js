const router = require("express").Router();
const con = require("../controller/Product");
const { verifyToken } = require("../middlewares/verifyToken");


router.post("/",verifyToken,con.createProduct);
router.get("/",verifyToken,con.allprod);
router.post("/search",verifyToken,con.gitwithname);

module.exports = router;
