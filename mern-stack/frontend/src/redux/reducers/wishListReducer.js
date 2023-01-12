import {
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "../constants/wishListConstants";

export const addToWishlistReducer = (state = { FavProducts: [] }, action) => {
  switch (action.type) {
    case ADD_TO_WISHLIST:
      console.log("z", action.payload);
      const productBeingAddedToWishlist = action.payload;

      const productAlreadyExistsInWishlist = state.FavProducts.find(
        (x) => x.productID === productBeingAddedToWishlist.productID
      );

      if (productAlreadyExistsInWishlist) { 
        console.log("already added");

        const removeProduct = state.FavProducts.filter(
          (x) => x.productID !== productBeingAddedToWishlist.productID
        );

        console.log("xcv", removeProduct);

        state.FavProducts = removeProduct;

        return state;
      } else {
        console.log("reached");

        state.FavProducts = [...state.FavProducts, productBeingAddedToWishlist];
      }

      return state;

    default: {
      return state;
    }
  }
};
