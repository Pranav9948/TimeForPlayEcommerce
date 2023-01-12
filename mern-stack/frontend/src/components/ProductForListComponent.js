import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";
import { useEffect, useState } from "react";
import { addToWishlist } from "../redux/actions/wishListActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
 import { ToastContainer, toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
const ProductForListComponent = ({
  productId,
  name,
  description,
  price,
  images,
  rating,
  reviewsNumber,
}) => {
  const [addToFav, setAddToFav] = useState("add to favorite");
  const [btnCol,setBtnCol]=useState('')
  const [heartBtn,setHeartBtn]=useState('')
   const FavProducts = useSelector((state) => state.wishList.FavProducts);

  const dispatch=useDispatch()


  const addToWishlist = async (productId) => {
    const { data } = await axios.post("/api/users/user/wishlist", {
      productId,
    });

    console.log("kkk",data)
    
    toast.success("added to favorites", {
      theme: "colored",
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };






  

  return (
    <Card style={{ marginTop: "30px", marginBottom: "50px" }}>
      <div className={`productList${heartBtn}`}>
        <Row>
          <Col lg={4}>
            <i class="fa-solid fa-heart " style={{ color: "red" }}></i>
            <Card.Img
              crossOrigin="anonymous"
              variant="top"
              height={"100%"}
              src={images[0] ? images[0].path : ""}
            />
          </Col>
          <Col lg={7}>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Text>{description}</Card.Text>
              <Card.Text>
                <Rating readonly size={20} initialValue={rating} /> (
                {reviewsNumber})
              </Card.Text>
              <Card.Text className="h4" style={{ marginBottom: "25px" }}>
                ₹{price}{" "}
              </Card.Text>

              <Card.Text>
                <div className={`favBtn${btnCol}`}>
                  <LinkContainer to={`/product-details/${productId}`}>
                    <Button variant="danger" style={{ marginLeft: "20px" }}>
                      See product
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="warning"
                    onClick={() => addToWishlist(productId)}
                    style={{ marginLeft: "20px" }}
                  >
                    <ToastContainer autoClose={2000}  />
                    {addToFav}
                  </Button>
                </div>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ProductForListComponent;
