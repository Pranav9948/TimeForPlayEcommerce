import React from 'react'
import axios from 'axios'

 async function CartPassBackend(usercart) {
 
      axios.post('/api/users/cartContent',{usercart}).then((res)=>{
        console.log(res)
      })

}

export default CartPassBackend