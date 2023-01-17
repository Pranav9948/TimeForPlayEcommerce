import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";
import {applyCoupon} from '../../../redux/actions/couponAction'

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import { LinkContainer } from "react-router-bootstrap";
import swal from "sweetalert";

const UserCartDetailsPageComponent = ({cartItems, itemsCount, cartSubtotal, userInfo,addToCart, removeFromCart, reduxDispatch , getUser, createOrder}) => {

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [userAddress, setUserAddress] = useState(false);
    const [missingAddress, setMissingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("pp");
    const [couponz, setCouponz] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const[couponDetails,setCouponDetails]=useState({})
    const [couponStatus,setCouponStatus]=useState(false)
    const [orderSuccess,setOrderSuccess]=useState(false)

    console.log(discountedPrice + "wertyhujytre");

    const navigate = useNavigate();
    const dispatch=useDispatch()
    
  const cartz = useSelector((state) => state.cart.cartSubtotal);
  
  const priceAfterDiscount = useSelector(
    (state) => state.Discount.discountedPrice
  );

    const changeCount = (productID, count) => {
        reduxDispatch(addToCart(productID, count));
    }

    const removeFromCartHandler = (productID, quantity, price) => {


  swal({
    title: "Are you sure?",
    text: "Once deleted, you will need to add products again...",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      reduxDispatch(removeFromCart(productID, quantity, price));
      swal("Product Removed", {
        icon: "success",
      });
    } else {
      swal("product Removal cancelled !!!");
    }
  });

    }

    useEffect(() => {
        getUser()
        .then((data) => {
            if (!data.address || !data.city || !data.country || !data.zipCode || !data.state || !data.phoneNumber) {
                setButtonDisabled(true);
                setMissingAddress(" .In order to make order, fill out your profile with correct address, city etc.");
            } else {
                setUserAddress({address: data.address, city: data.city, country: data.country, zipCode: data.zipCode, state: data.state, phoneNumber: data.phoneNumber})
                setMissingAddress(false);
            }
        })
        .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data));
    }, [userInfo._id])

    const orderHandler = () => {

      console.log('1');


      setOrderSuccess(true);
        const orderData = {
          orderTotal: {
            itemsCount: itemsCount,
            cartSubtotal: discountedPrice ? discountedPrice : cartSubtotal,
          },
          cartItems: cartItems.map((item) => {

             console.log("2");
            return {
              productID: item.productID,
              name: item.name,
              price: item.price,
              image: { path: item.image ? item.image.path ?? null : null },
              quantity: item.quantity,
              count: item.count,
            };
          }),
          paymentMethod: paymentMethod,
        };
        createOrder(orderData)
          .then((data) => {
             console.log("3");
            if (data) {
              navigate("/order-details/" + data._id);
            }
          })
          .catch((err) => console.log(err));

          if(priceAfterDiscount.length>0){

            console.log("priceAD",priceAfterDiscount)
          removeAppliedCoupon()

          }
         
      
    }

const removeAppliedCoupon=async()=>{

  await axios.get("/api/coupon/appliedCoupon");
}




    const choosePayment = (e) => {
        setPaymentMethod(e.target.value);
    }



    const couponSubmit = (e) => {
      e.preventDefault();
      console.log("kii", couponz);

      const applyCouponz = async () => {
        console.log("11coupon submitted");
        const { data } = await axios.post("/api/users/coupon", { couponz });
        const { discount, expiry, name } = data;

        let amountAfterDiscount = (cartz - (cartz * discount) / 100).toFixed(2);

        console.log("amountAfterDiscount  ", amountAfterDiscount);
        console.log(discount);
        console.log(cartz + '  cart');

        setDiscountedPrice(amountAfterDiscount);
        console.log("1")
       dispatch(applyCoupon(amountAfterDiscount));
       console.log("2");
       


      };

      applyCouponz()

    };

    const applyForCoupon=async()=>{
      
       const {data}= await axios.get("/api/coupon/sendCoupon");
       setCouponStatus(true);
          console.log("124",data)
          
          setCouponDetails(data)
    }

 


  return (
    <Container fluid>
      <Row className="mt-5 ms-3 me-3">
        <h2>Cart Details</h2>

        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <Col>
                <LinkContainer to="/user">
                  <Button
                    className="mt-2 mb-4 ms-3"
                    size="lg"
                    variant="success"
                    type="button"
                  >
                    Change Delivery Address
                  </Button>
                </LinkContainer>
              </Col>
              <h2 className="ms-2">Shipping</h2>

              <ListGroup className="p-2 ms-1">
                <ListGroup.Item>
                  <b>Name</b>: {userInfo.name} {userInfo.lastName} <br />
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Address</b>: {userAddress.address} {userAddress.city}{" "}
                </ListGroup.Item>
                <ListGroup.Item>
                  {userAddress.state} {userAddress.zipCode} <br />
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Phone</b>: {userAddress.phoneNumber}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={6}>
              <h2 style={{ marginTop: "-70px" }} className="ms-0 mb-5">
                {" "}
                Select Payment Method
              </h2>{" "}
              <Form.Select
                onChange={choosePayment}
                style={{ width: "60%" }}
                className="ms-4"
              >
                <option value="pp">PayPal</option>
                <option value="cod">
                  Cash On Delivery (delivery may be delayed)
                </option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                {missingAddress ? (
                  <Alert className="mt-3" variant="danger">
                    {missingAddress}
                  </Alert>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Row>
          <br />
          <h2 className="ms-1 mb-4">Order items</h2>
          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent
                item={item}
                key={idx}
                removeFromCartHandler={removeFromCartHandler}
                changeCount={changeCount}
              />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <h2 style={{ marginTop: "-50px" }}>Order summary</h2>
          <ListGroup className="mt-4 ms-2">
            <ListGroup.Item>
              Items price (after tax):{" "}
              {discountedPrice ? <> {discountedPrice}</> : <>{cartz}</>}
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price:{" "}
              {discountedPrice ? <> {discountedPrice}</> : <>₹{cartz}</>}
            </ListGroup.Item>

            <ListGroup.Item className="text-success">
              Discountedd price:{" "}
              <span className="fw-bold">
                ₹
                {discountedPrice ? (
                  <> {discountedPrice}</>
                ) : (
                  "No coupon available"
                )}
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  onClick={orderHandler}
                  variant="danger"
                  type="button"
                  disabled={buttonDisabled}
                >
                  Place order
                </Button>
              </div>
            </ListGroup.Item>
          </ListGroup>
          <br></br> <br></br>
          <ListGroup>
            <ListGroup.Item className="p-3">
              <Button size="lg" type="button" onClick={applyForCoupon}>
                Apply for a coupon
              </Button>
              <br></br>
            </ListGroup.Item>
            <Form onSubmit={couponSubmit}>
              <Form.Group className="mb-3 me-5 ms-3" controlId="formBasicEmail">
                <Form.Control
                  style={{ width: "60%" }}
                  type="text"
                  placeholder="Enter coupon code"
                  onChange={(e) => setCouponz(e.target.value)}
                  value={couponz}
                />
              </Form.Group>
              <Button variant="primary" className="ms-4" type="submit">
                APPLY
              </Button>{" "}
              <br></br>
            </Form>
            {couponStatus ? (
              <h3 className="mt-3">
                CouponCode: {couponDetails.name} <br></br>
                Coupon Discount : {couponDetails.discount}%{" "}
              </h3>
            ) : (
              " "
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserCartDetailsPageComponent;
