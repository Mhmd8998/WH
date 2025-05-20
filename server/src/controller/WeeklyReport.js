const reportModel = require('../model/WeeklyReport');

function generateWeeklyReport(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'يرجى تحديد تاريخ البداية والنهاية' });
  }

  const data = {};

  reportModel.getWeeklyProductInputs(start, end, (err, inputs) => {
    if (err) return res.status(500).json({ error: err.message });
    data.inputs = inputs;

    reportModel.getWeeklyWithdrawals(start, end, (err, withdrawals) => {
      if (err) return res.status(500).json({ error: err.message });
      data.withdrawals = withdrawals;

      reportModel.getTotalInputByProduct(start, end, (err, totalInputs) => {
        if (err) return res.status(500).json({ error: err.message });
        data.totalInputs = totalInputs;

        reportModel.getTotalWithdrawalByProduct(start, end, (err, totalWithdrawals) => {
          if (err) return res.status(500).json({ error: err.message });
          data.totalWithdrawals = totalWithdrawals;

          // إرجاع التقرير
          res.json(data);
        });
      });
    });
  });
}

module.exports = {
  generateWeeklyReport
};
