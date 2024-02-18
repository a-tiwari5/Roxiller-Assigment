const { default: axios } = require("axios");
const Transaction = require("../model/transaction");

const get_transactions = async (req, res) => {
  const { page = 1, pageSize = 10, search } = req.query;
  let transactions;
  if (!search) {
    transactions = await Transaction.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();
    res
      .status(200)
      .send({ success: true, transactions, count: transactions.length });
  } else {
    transactions = await Transaction.find({
      $text: { $search: search },
    })
      .limit(pageSize)
      .skip(pageSize * page)
      .sort({
        price: "desc",
      })
      .lean();
    res
      .status(200)
      .send({ success: true, transactions, count: transactions.length });
  }
};

const get_stats = async (req, res) => {
  const { month = 3 } = req.params;
  const stats = await Transaction.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, parseInt(month)],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSoldItems: { $sum: { $cond: { if: "$sold", then: 1, else: 0 } } },
        totalUnsoldItems: {
          $sum: { $cond: { if: "$sold", then: 0, else: 1 } },
        },
        totalPriceSold: {
          $sum: { $cond: { if: "$sold", then: "$price", else: 0 } },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalSoldItems: 1,
        totalUnsoldItems: 1,
        totalPriceSold: 1,
      },
    },
  ]);

  res.status(200).json({ sucess: true, data: stats[0] });
};

const get_bar_stats = async (req, res) => {
  const { month = 3 } = req.params;

  // Define price ranges
  const priceRanges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  // Generate an array of range documents with count 0 for all ranges
  const allRanges = priceRanges.map((range, index) => ({
    range: `${range}-${priceRanges[index + 1] || ""}`,
    count: 0,
    price: [],
    title: [],
  }));

  // Aggregate transactions for the given month
  const stats = await Transaction.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
      },
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: priceRanges.map((range, index) => ({
              case: {
                $and: [
                  { $gte: ["$price", range] },
                  { $lt: ["$price", priceRanges[index + 1] || Infinity] },
                ],
              },
              then: `${range}-${priceRanges[index + 1] || ""}`,
            })),
            default: "Other",
          },
        },
        count: { $sum: 1 },
        price: { $push: "$price" },
        title: { $push: "$title" },
      },
    },
    {
      $project: {
        _id: 0,
        range: "$_id",
        count: 1,
        price: 1,
        title: 1,
      },
    },
  ]);

  // Create a map of ranges from the aggregated statistics
  const rangeMap = new Map(stats.map((stat) => [stat.range, true]));

  // Filter out ranges that already exist in the aggregated statistics
  const uniqueRanges = allRanges.filter((range) => !rangeMap.has(range.range));

  // Merge stats with uniqueRanges to include ranges with count 0 and avoid duplicates
  const mergedStats = [...stats, ...uniqueRanges];

  mergedStats.sort((a, b) => {
    const rangeA = a.range.split("-");
    const rangeB = b.range.split("-");
    const startA = parseInt(rangeA[0]);
    const startB = parseInt(rangeB[0]);
    return startA - startB;
  });

  res.status(200).json({ success: true, data: mergedStats });
};

const get_pie_stats = async (req, res) => {
  const { month = 3 } = req.params;

  const stats = await Transaction.aggregate([
    {
      $match: {
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
      },
    },
    {
      $bucket: {
        groupBy: "$category",
        boundaries: [
          "electronics",
          "jewelery",
          "men's clothing",
          "women's clothing",
        ],
        default: "Other",
        output: {
          count: { $sum: 1 },
          title: { $push: "$title" },
          dateOfSale: { $push: "$dateOfSale" },
          category: { $push: "$category" },
        },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        price: "$price",
        title: "$title",
        dateOfSale: "$dateOfSale",
        category: "$category",
      },
    },
  ]);
  res.status(200).json({ success: true, data: stats });
};
const get_combined_data = async (req, res) => {
  const { month } = req.params;
  const stats = await axios.get(
    `http://localhost:5000/api/v1/transactions/stats/${month}`
  );
  const bar_stats = await axios.get(
    `http://localhost:5000/api/v1/transactions/bar_stats/${month}`
  );
  const pie_stats = await axios.get(
    `http://localhost:5000/api/v1/transactions/pie_stats/${month}`
  );
  res.json({
    sucess: true,
    stats: stats.data,
    bar_stats: bar_stats.data,
    pie_stats: pie_stats.data,
  });
};

module.exports = {
  get_transactions,
  get_bar_stats,
  get_stats,
  get_combined_data,
  get_pie_stats,
};
