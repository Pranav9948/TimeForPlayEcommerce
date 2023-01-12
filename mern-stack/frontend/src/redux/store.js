import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import { cartReducer } from "./reducers/cartReducers";
import { userRegisterLoginReducer } from "./reducers/userReducers";
import { getCategoriesReducer } from "./reducers/categoryReducers";
import { addToWishlistReducer } from "./reducers/wishListReducer";
import { applyCouponReducer } from "./reducers/couponReducer";


const reducer = combineReducers({
  cart: cartReducer,
  userRegisterLogin: userRegisterLoginReducer,
  getCategories: getCategoriesReducer,
  wishList: addToWishlistReducer,
  Discount: applyCouponReducer,
});

const cartItemsInLocalStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];
const wishListInLocalStorage = localStorage.getItem("wishList")
  ? JSON.parse(localStorage.getItem("wishList"))
  : [];
  const discountInLocalStorage = localStorage.getItem("Discount")
    ? JSON.parse(localStorage.getItem("Discount"))
    : [];


const userInfoInLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : sessionStorage.getItem("userInfo")
  ? JSON.parse(sessionStorage.getItem("userInfo"))
  : {};

 

const INITIAL_STATE = {
  cart: {
    cartItems: cartItemsInLocalStorage,
    itemsCount: cartItemsInLocalStorage
      ? cartItemsInLocalStorage.reduce(
          (quantity, item) => Number(item.quantity) + quantity,
          0
        )
      : 0,
    cartSubtotal: cartItemsInLocalStorage
      ? cartItemsInLocalStorage.reduce(
          (price, item) => price + item.price * item.quantity,
          0
        )
      : 0,
  },
  userRegisterLogin: { userInfo: userInfoInLocalStorage },
  wishList: {
    FavProducts: wishListInLocalStorage,
  },

  Discount:{
    discountedPrice:discountInLocalStorage
  }
};

const middleware = [thunk];
const store = createStore(
  reducer,
  INITIAL_STATE,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
