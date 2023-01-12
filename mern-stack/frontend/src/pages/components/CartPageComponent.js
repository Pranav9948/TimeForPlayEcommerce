import { Container, Row, Col, Alert, ListGroup, Button } from "react-bootstrap";
import CartItemComponent from "../../components/CartItemComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartPassBackend from "../user/CartPassBackend";

import swal from 'sweetalert';


import { useState } from "react";

const CartPageComponent = ({
  addToCart,
  removeFromCart,
  cartItems,
  cartSubtotal,
  reduxDispatch,
}) => {
  

  const navigate = useNavigate();
  const userCart = useSelector((state) => state.cart);

  const changeCount = (productID, count) => {
    reduxDispatch(addToCart(productID, count));
  };




  const removeFromCartHandler = (productID, quantity, price) => {

      swal({
        title: "Are you sure?",
        text: "Once deleted, you will need to add product to cart again...",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          reduxDispatch(removeFromCart(productID, quantity, price));
          swal("Product Removed from cart", {
            icon: "success",
        
          });
        } else {
          swal("product Remove from cart Dismissed !!!");
        }
      });

    
  };

  const saveOrderstoDb = () => {
    console.log("kk", JSON.stringify(userCart, null, 4));
    CartPassBackend(userCart);

    navigate("/cart-details");
  };

  return (
    <Container fluid>
      <Row className="mt-4 ms-3 me-3">
        <Col md={8}>
          <h1 className="mt-3 mb-5">Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Alert variant="info">Your cart is empty</Alert>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item, idx) => (
                <CartItemComponent
                  item={item}
                  key={idx}
                  changeCount={changeCount}
                  removeFromCartHandler={removeFromCartHandler}
                />
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                Subtotal ({cartItems.length}{" "}
                {cartItems.length === 1 ? "Product" : "Products"})
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Price: <span className="fw-bold">₹{cartSubtotal}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                disabled={cartSubtotal === 0}
                type="button"
                onClick={saveOrderstoDb}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
          

            
        </Col>
      </Row>
    </Container>
  );
};

export default CartPageComponent;
