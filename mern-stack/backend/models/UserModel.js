const mongoose = require("mongoose");
const product=require('./ProductModel')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    cart: {
      type: Array,
      default: [],
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: product,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;