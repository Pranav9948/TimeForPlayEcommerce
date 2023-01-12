import React, { useState } from 'react'
import Form from "react-bootstrap/Form";
import axios from 'axios';
import Button from "react-bootstrap/Button";

function ForgotPassword() {

    const [email,setEmail]=useState('')
    const[nouser,setNouser]=useState('')
       const [registerEmail, setRegisterEmail] = useState("");

    const submitHandler=async(e)=>{

        e.preventDefault()
        const { data } = await axios.post("/api/users/forgotPassword", {
          email,
        });

        setNouser(data.status)

        setRegisterEmail(data.success)
       
      
    }


  return (
    <div className="center p-5">
      <h1 className="text-center mb-3">Forgot password</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          <Button variant="primary" className="mt-3" type="submit">
            Submit
          </Button>{" "}
          {nouser ? <h5 className="mt-3">{nouser}</h5> : ""}
          {registerEmail ? <h5 className="mt-3">{registerEmail}</h5> : ""}
        </Form.Group>
      </Form>
    </div>
  );
}

export default ForgotPassword