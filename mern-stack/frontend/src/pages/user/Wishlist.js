// import React from "react";
// import { Container,Row,Col } from "react-bootstrap";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { LinkContainer } from "react-router-bootstrap";
// import { useDispatch } from "react-redux";
// import {addToWishlist} from '../../redux/actions/wishListActions'

// function Wishlist() {
//   const FavProducts = useSelector((state) => state.wishList.FavProducts);
//   const [favproductDetail, setFavproductDetail] = useState([]);

//   const dispatch=useDispatch()

//    function RemoveWishlist(productID){

//       dispatch(addToWishlist(productID))
//       setFavproductDetail(FavProducts);
//    }
  

//   useEffect(() => {
//     setFavproductDetail(FavProducts);
//   }, [favproductDetail,FavProducts,dispatch])
//   return (
  //   <Container>
  //     <Row>
        
  //         {FavProducts.map((wishListProduct) => {
  //           return (
  //             <Col md={4}>
  //               <Card className="mt-5">
  //                 {console.log("kai", favproductDetail)}
  //                 <Card.Img
  //                   variant="top"
  //                   src={wishListProduct.image.path}
  //                   height={"350px"}
  //                 />
  //                 <Card.Body>
  //                   <Card.Title>
  //                     {wishListProduct.name.substring(0, 17)}
  //                   </Card.Title>
  //                   <br></br>

  //                   <Row>
  //                     <Col>
  //                       <LinkContainer
  //                         to={`/product-details/${wishListProduct.productID}`}
  //                       >
  //                         <Button variant="primary">See Product Details</Button>
  //                       </LinkContainer>
  //                     </Col>

  //                     <Col>
  //                       <Button
  //                         variant="warning"
  //                         onClick={() =>
  //                           RemoveWishlist(wishListProduct.productID)
  //                         }
  //                       >
  //                         Remove from Wishlist
  //                       </Button>
  //                     </Col>
  //                   </Row>
  //                 </Card.Body>
  //               </Card>
  //             </Col>
  //           );
  //         })}
       
  //     </Row>
  //   </Container>
  // );
// }

// export default Wishlist;
