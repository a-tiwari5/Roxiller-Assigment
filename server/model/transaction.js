const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        "men's clothing",
        "jewelery",
        "electronics",
        "women's clothing",
        "men's clothing",
      ],
    },
    image: {
      type: String,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    dateOfSale: {
      type: Date,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ title: "text", description: "text", price: "text" });

module.exports = mongoose.model("Transaction", transactionSchema);

//   {
//     "id": 1,
//     "title": "Fjallraven  Foldsack No 1 Backpack Fits 15 Laptops",
//     "price": 329.85,
//     "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop up to 15 inches in the padded sleeve your everyday",
//     "category": "men's clothing",
//     "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
//     "sold": false,
//     "dateOfSale": "2021-11-27T20:29:54+05:30"
//   },
