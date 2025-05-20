const express = require('express');
const router = express.Router();
const reportController = require('../controller/WeeklyReport');

// المسار لتوليد التقرير
router.get('/weekly-report', reportController.generateWeeklyReport);

module.exports = router;
