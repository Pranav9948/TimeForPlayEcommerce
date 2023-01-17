import { Carousel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import  Balls  from "./BannerImages/Balls.jpg";
import athle from "./BannerImages/athle.jpg";
import rug from "./BannerImages/rug.jpg";
import proTime from "./BannerImages/proTime.jpg";
import tennis from "./BannerImages/tennis.jpg";

const sportsImages=[Balls,proTime,tennis]






const  ProductCarouselComponent = ({ bestSellers }) => {
  const cursorP = {
    cursor: "pointer",
  };

  return bestSellers.length > 0 ? (
    <>

     <Carousel className="mt-5 ">
       {bestSellers.map((item, idx) => {

              return(

                <Carousel.Item key={idx}>
                <img
              crossOrigin="anonymous"
              className="d-block    "
              style={{
                height: "400px",
                objectFit: "cover",
                margin: "auto",
                display: "block",
                width: "100%",

              }}
              // src={item.images ? item.images[1].path : null}

              src={sportsImages[idx]}
              alt="First slide"
            />
            <div class="text-block">
              <Carousel.Caption className="seller">
                <LinkContainer
                  style={cursorP}
                  to={`/product-details/${item._id}`}
                >
                  <h3 className="fontDesign ">
                    Bestseller in {item.category} Category
                  </h3>
                </LinkContainer>
                <p className="paraDesign" style={{ color: "white" }}>
                  {item.name}
                </p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
              )
              
       })}
      </Carousel>
   
    </>
  ) : 
  null;
};

export default ProductCarouselComponent;
