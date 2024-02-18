const express = require("express");
const {
  get_combined_data,
  get_transactions,
  get_stats,
  get_bar_stats,
  get_pie_stats,
} = require("../controller/transaction");
const router = express.Router();

router.get("/api/v1/transactions/all", get_transactions);
router.get("/api/v1/transactions/stats/:month", get_stats);
router.get("/api/v1/transactions/bar_stats/:month", get_bar_stats);
router.get("/api/v1/transactions/pie_stats/:month", get_pie_stats);
router.get("/api/v1/transactions/combined/:month", get_combined_data);

module.exports = router;
