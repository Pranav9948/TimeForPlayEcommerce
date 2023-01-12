const mongoose = require("mongoose");

const {ObjectId}=mongoose.Schema

const couponSchema= new mongoose.Schema({

    name:{
        type:String,
        required:"Name is required",
        trim:true,
        uppercase:true,
        unique:true,
        minlenth:[6,"too small"],
        maxlength:[12,"too large"],

    },

    discount:{
        type:Number,
        required:true
    },

    expiry:{

        type:Date,
        required:true
    },


},
{
    timeStamps:true,
    
})

module.exports=mongoose.model('coupon',couponSchema); 