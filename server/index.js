const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");
const Transaction = require("./model/transaction");
dotenv.config({
  path: "./config/config.env",
});
const PORT = process.env.PORT;
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/seed_db", (req, res) => {
  try {
    fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((transaction) => {
          Transaction.create({
            ...transaction,
          });
        });
        res
          .status(200)
          .send({ success: true, message: "Seed data added successfullt" });
      });
  } catch (err) {
    res.status(500).send({ succes: false, message: err });
  }
});

app.use(transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
