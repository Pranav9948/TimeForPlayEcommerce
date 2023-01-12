import {ADD_TO_WISHLIST,REMOVE_FROM_WISHLIST} from '../constants/wishListConstants'
import axios from 'axios';


export const addToWishlist=(productId)=>async(dispatch,getState)=>{

 const { data } = await axios.get(`/api/products/get-one/${productId}`);


 dispatch({
   type: ADD_TO_WISHLIST,
   payload: {
     productID: data._id,
     name: data.name,
     price: data.price,
     image: data.images[0] ?? null,
     count: data.count,
     
   },
 });
localStorage.setItem("wishList", JSON.stringify(getState().wishList.FavProducts));

}