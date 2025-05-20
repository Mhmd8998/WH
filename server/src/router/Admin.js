const router = require("express").Router()
const {verifyToken,verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const  con = require("../controller/Admin");

router.get("/notification",verifyTokenAndAdmin,con.getAdminNotification)
router.put("/mark-read:id",verifyTokenAndAdmin,con.updateNotificationReadStatus)
router.put("/setGre",verifyToken,con.setAdmin)

module.exports = router;
