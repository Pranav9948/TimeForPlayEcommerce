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
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const UserOrderDetailsPageComponent = ({
  userInfo,
  getUser,
  getOrder,
  loadPayPalScript,
}) => {
  const [userAddress, setUserAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [orderButtonMessage, setOrderButtonMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [orderSuccess,setOrderSuccess]=useState(false)


  const paypalContainer = useRef();
  const dispatch = useDispatch();

  const priceAfterDiscount=useSelector((state)=>state.Discount.discountedPrice)
  console.log("pp",priceAfterDiscount)
const cartz = useSelector((state) => state.cart.cartSubtotal);

  console.log("joel",cartz)

  const { id } = useParams();

  useEffect(() => {
    getUser()
      .then((data) => {
        setUserAddress({
          address: data.address,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
          state: data.state,
          phoneNumber: data.phoneNumber,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    getOrder(id)
      .then((data) => {
        setPaymentMethod(data.paymentMethod);
        setCartItems(data.cartItems);
        setCartSubtotal(data.orderTotal.cartSubtotal);
        data.isDelivered
          ? setIsDelivered(data.deliveredAt)
          : setIsDelivered(false);
        data.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false);
        if (data.isPaid) {
          setOrderButtonMessage("Your order is finished");
          setButtonDisabled(true);
        } else {
          if (data.paymentMethod === "pp") {
            setOrderButtonMessage("Pay for your order");
          } else if (data.paymentMethod === "cod") {
            setButtonDisabled(true);
            setOrderButtonMessage("Wait for your order. You pay on delivery");
            setOrderSuccess(true)
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const orderHandler = () => {

    
    setButtonDisabled(true);
    if (paymentMethod === "pp") {
      setOrderButtonMessage(
        "To pay for your order click one of the buttons below"
      );
      if (!isPaid) {
        loadPayPalScript(priceAfterDiscount,cartSubtotal, cartItems, id, updateStateAfterOrder);
      }
    } else {
      setOrderButtonMessage("Your order was placed. Thank you");
      
      
    }

  };

 

  const updateStateAfterOrder = (paidAt) => {
    setOrderButtonMessage("Thank you for your payment!");
    setIsPaid(paidAt);
    setButtonDisabled(true);
    paypalContainer.current.style = "display: none";
    setOrderSuccess(true);
  };

  

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1 className="ms-3">ORDER DETAILS</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <ListGroup className="ms-3">
                <ListGroup.Item>
                  {" "}
                  <h2>SHIPPING</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Name</b>: {userInfo.name} {userInfo.lastName}
                </ListGroup.Item>{" "}
                <br />
                <ListGroup.Item>
                  <b>Address</b>: {userAddress.address} {userAddress.city}{" "}
                  {userAddress.state} {userAddress.zipCode}{" "}
                </ListGroup.Item>{" "}
                <br />
                <ListGroup.Item>
                  <b>Phone</b>: {userAddress.phoneNumber}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup>
                <ListGroup.Item>
                  <h2>PAYMENT METHOD</h2>
                </ListGroup.Item>
                <Form.Select
                  className="ms-3 p-2 mt-3 mb-3"
                  value={paymentMethod}
                  disabled={true}
                  style={{ width: "60%" }}
                >
                  <option value="pp">PayPal</option>
                  <option value="cod">
                    Cash On Delivery (delivery may be delayed)
                  </option>
                </Form.Select>
              </ListGroup>
            </Col>
            <Row>
              <Col>
                <Alert
                  className="mt-3 ms-4"
                  variant={isDelivered ? "success" : "danger"}
                  style={{ width: "70%" }}
                >
                  {isDelivered ? (
                    <>Delivered at {isDelivered}</>
                  ) : (
                    <>will be Delivered</>
                  )}
                </Alert>
              </Col>
              <Col>
                <Alert
                  className="mt-3 ms-3"
                  variant={isPaid ? "success" : "danger"}
                  style={{ width: "70%" }}
                >
                  {isPaid ? (
                    <>Paid on {isPaid}</>
                  ) : (
                    <> Payment-Method : {paymentMethod}</>
                  )}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />

          <ListGroup></ListGroup>
          <h2 className="ms-3 mb-4">ORDER ITEMS</h2>

          <ListGroup variant="flush">
            {cartItems.map((item, idx) => (
              <CartItemComponent item={item} key={idx} orderCreated={true} />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <h2 className="mt-5 fs-1">ORDER SUMMARY</h2>
          <ListGroup>
            <ListGroup.Item></ListGroup.Item>
            {console.log("subtotal", cartz)}
            <ListGroup.Item>
              Items price (after tax): ₹
              {priceAfterDiscount.length ? priceAfterDiscount : cartSubtotal}
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price:{" "}
              <span className="fw-bold">
                ₹{" "}
                {priceAfterDiscount.length ? (
                  <>{priceAfterDiscount}</>
                ) : (
                  <> {cartSubtotal}</>
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
                  {orderButtonMessage}
                </Button>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div ref={paypalContainer} id="paypal-container-element"></div>
              </div>

              {orderSuccess ? (
                <>
                  
                  {localStorage.removeItem("cart")}
                  <h2 className="mt-4" style={{ color: "green" }}>
                    Order Placed Successfully{" "}
                    <span>
                      {" "}
                      <br></br>{" "}
                      <Link to="/my-orders">
                        <h4> See Orders</h4>{" "}
                      </Link>
                    </span>
                  </h2>
                </>
              ) : (
                ""
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetailsPageComponent;
