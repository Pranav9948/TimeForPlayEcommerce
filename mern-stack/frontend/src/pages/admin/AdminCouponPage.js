import axios from 'axios'

export const getCoupon=async()=>{

   const {data}=  await axios.get('/api/coupon')

   return data
}

export const deleteCoupon=async(couponId)=>{

    const {data}= await axios.delete(`/api/coupon/${couponId}`)
}

export const createCoupon=async(coupon)=>{

    const {data}=await axios.post('/api/coupon',{coupon})
//     console.log("aii",data)
}