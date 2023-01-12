import React from 'react'
import WishlistComponent from '../components/WishlistComponent'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Wishlists() {


   


const showWishlists=async(userId)=>{

    const { data } = await axios.get(`/api/users/user/wishlist/${userId}`);

    return data

}

const addWishlists = async (productId) => {
  const { data } = await axios.post("/api/users/user/wishlist",{productId});

  return data;
};


const RemoveWishlist=async(productId)=>{

    const {data}=await axios.put(`/api/users/user/wishlist/${productId}`)
    return data
}


  return (
    <>
    
  
  
    
\
      
    
  
    <WishlistComponent showWishlists={showWishlists} addWishlists={addWishlists} RemoveWishlist={RemoveWishlist}/>
    </>
  )
}

export default Wishlists