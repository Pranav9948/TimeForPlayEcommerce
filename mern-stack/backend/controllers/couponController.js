const Coupons = require("../models/CouponModel");

exports.createCoupon = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body.coupon;
    await new Coupons({ name, expiry, discount }).save();

    res.json("coupon created");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    res.json(await Coupons.findByIdAndDelete(req.params.couponId).exec());
  } catch (err) {
    console.log(err);
  }
};

exports.listCoupon = async (req, res) => {
  try {
    res.json(await Coupons.find({}).sort({ createdAt: -1 }).exec());
  } catch (err) {
    console.log(err);
  }
};



exports.sendCoupon = async (req, res) => {
  try {

   const allCoupons=  await Coupons.find({}).sort({ createdAt: -1 }).exec();
   console.log('1243',allCoupons)
     const singleCoupon=allCoupons[0]
    


     res.json(singleCoupon)

     
     
  } 
  
  catch (err) {
    console.log(err);
  }
};


exports.deleteAppliedCoupon=async(req,res)=>{
  console.log("hhhhh")
try {
  console.log("kkk");
  const allCoupons = await Coupons.find({}).sort({ createdAt: -1 }).exec();

  

 if(allCoupons.length>0){
  const appliedCouponId = allCoupons[0]._id;

  console.log("applied", appliedCouponId);

  console.log("coupon deleted11");
  await Coupons.findByIdAndRemove(appliedCouponId);
  console.log("coupon deleted");
 }
} catch (err) {
  console.log(err);
}

}