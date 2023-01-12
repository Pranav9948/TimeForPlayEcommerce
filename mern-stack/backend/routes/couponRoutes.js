
const express=require('express');
const router=express.Router();


const {
  createCoupon,
  deleteCoupon,
  listCoupon,
  sendCoupon,
  deleteAppliedCoupon,
} = require("../controllers/couponController");


router.post('/',createCoupon)
router.delete('/:couponId',deleteCoupon)
router.get('/',listCoupon)
router.get("/sendCoupon",sendCoupon);
router.get("/appliedCoupon", deleteAppliedCoupon);

module.exports=router;