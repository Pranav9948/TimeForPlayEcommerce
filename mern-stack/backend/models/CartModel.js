const mongoose = require("mongoose")
const User = require("./UserModel")
const Product=require('./ProductModel')


const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: User,
    },

    cartItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { path: { type: String, required: true } },
        quantity: { type: Number, required: true },
        count: { type: Number, required: true },
      },
    ],
    itemsCount: { type: Number, required: true },
    cartSubtotal: { type: Number, required: true },
   
  },
  {
    timeStamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports=Cart