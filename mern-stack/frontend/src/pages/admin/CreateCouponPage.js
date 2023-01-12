import react from'react';
import {useSelector,useDispatch} from 'react'
import {toast} from 'react-toastify'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useState,useEffect} from 'react'

import {createCoupon,deleteCoupon,getCoupon} from './AdminCouponPage'
import AdminLinksComponent from '../../components/admin/AdminLinksComponent';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Table from "react-bootstrap/Table";





function CreateCouponPage() {

  const [name,setName]=useState("");
  const [expiry, setExpiry] = useState(new Date());
  const [discount,setDiscount]=useState('')
  const [loading,setLoading]=useState('')

  const[coupons,setCoupons]=useState([])


  const handleSubmit=(e)=>{
console.log("hello");
    e.preventDefault()
    setLoading(true)

    createCoupon({name,expiry,discount}).then((res)=>{

      setLoading(false)
      setName("")
      setDiscount("")
      setExpiry("")

      toast.success(`coupon created`)
    }).catch((err)=>{

      console.log(err)
    })
    
    console.log(name,discount,expiry)
  }


  const couponDelete=(id)=>{

    if(window.confirm("delete ? ")){

    
    deleteCoupon(id).then((res)=>{

      console.log('res')
    }).catch((err)=>{
      console.log(err)
    })
  }
  }

  useEffect(() => {
    getCoupon().then((res) => setCoupons(res));
  }, [coupons]);




  return (
    <Container>
      <Row>
     
        <Col md={2} className="mt-5 mb-5">
          <AdminLinksComponent />
        </Col>

        <Col md={7} className="m-5">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CouponName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Discount %</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoFocus
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Expiry Date</Form.Label>

              <DatePicker
                className="form-control"
                selected={expiry}
                onChange={(date) => setExpiry(date)}
                value={expiry}
              />
            </Form.Group>

            <Button className="btn btn-primary mt-4" type="submit">
              Save
            </Button>
          </Form>
        </Col>
      </Row>

      <h3 className="text-center">COUPONS</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>NAME</th>
            <th>DISCOUNT</th>
            <th>EXPIRY</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c, idx) => {
            return (
              <tr>
                <td>{idx + 1}</td>
                <td>{c.name}</td>
                <td>{c.discount}</td>
                <td>{c.expiry}</td>
                <td>
                  <i class="fa-solid fa-trash ms-5" onClick={()=>couponDelete(c._id)}></i>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
  }



export default CreateCouponPage