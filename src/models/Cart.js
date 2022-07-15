const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    
    products: [{
      name: {
        type: String,
        required: true
      },
        bookId: {
      type: String,
           required: true
    },
      front: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      offerprice: {
        type: Number,
      },
      autername: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      color: {
        type: String,
      },
      sellerName: {
        type: String,
      },
      sellerPhone: {
        type: Number,
      }

    }],
    status: {
      type: String
    },
  }
  // { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
