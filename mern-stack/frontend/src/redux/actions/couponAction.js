import * as actionTypes from "../constants/couponConstants";



export const applyCoupon = (amountAfterDiscount) => async (dispatch,getState) => {
  
 console.log("action1", amountAfterDiscount);

  dispatch({
    type: actionTypes.APPLY_COUPON,
    payload: amountAfterDiscount,
  });

 


   localStorage.setItem(
     " Discount",
     JSON.stringify(getState().Discount.discountedPrice)
   );
};
