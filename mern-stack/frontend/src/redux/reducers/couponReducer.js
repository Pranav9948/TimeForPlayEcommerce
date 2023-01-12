import * as actionTypes from "../constants/couponConstants";

export const applyCouponReducer = (state = {}, action) => {

  switch (action.type) {
    case actionTypes.APPLY_COUPON:
        
      console.log("action13", action.payload);
      return {
        ...state,
        discountedPrice: action.payload,
      };
    
    default:
      return state;
  }
};
