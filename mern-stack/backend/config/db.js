//Connection file to mongo db
const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();


// devServer: {
//   compress: true,
//   public: 'store-client-nestroia1.c9users.io' // That solved it
// }


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected :  ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
