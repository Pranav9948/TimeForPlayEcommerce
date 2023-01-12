import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container,Row,Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";


function WishlistComponent({showWishlists,addWishlists, RemoveWishlist}) {

    const [FavProducts,setFavProducts]=useState([])

const userId=useSelector((state)=>state.userRegisterLogin.userInfo._id)

useEffect(()=>{

    loadWishlist()
},[])

const loadWishlist=()=>{

     showWishlists(userId).then((x)=>{
        setFavProducts(x.wishlist)
     })
}


const RemoveWishlists=(productID)=>{

    console.log('1')
    RemoveWishlist(productID).then((data)=>{
        loadWishlist()
    })
}

  return (
    <Container>
     
      <Row>
        {FavProducts.map((wishListProduct) => {
          return (
            <Col md={4}>
              <Card className="mt-5">
                
                <Card.Img
                  variant="top"
                  src={wishListProduct.images[0].path}
                  height={"350px"}
                />
                <Card.Body>
                  <Card.Title>
                    {wishListProduct.name.substring(0, 17)}
                  </Card.Title>
                  <br></br>

                  <Row>
                    <Col>
                      <LinkContainer
                        to={`/product-details/${wishListProduct._id}`}
                      >
                        <Button variant="primary">See Product Details</Button>
                      </LinkContainer>
                    </Col>

                    <Col>
                      <Button
                        variant="warning"
                        onClick={() =>
                          RemoveWishlists(wishListProduct._id)
                        }
                      >
                        Remove from Wishlist
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
  
}

export default WishlistComponent