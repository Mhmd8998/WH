const router = require("express").Router();
const con = require("../controller/Auth");

router.post("/register",con.createUser);
router.post("/login",con.login);

module.exports = router;