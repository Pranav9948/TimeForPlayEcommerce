import { Carousel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const  ProductCarouselComponent = ({ bestSellers }) => {
  const cursorP = {
    cursor: "pointer",
  };

  return bestSellers.length > 0 ? (
    <Carousel className="mt-5 ">
      {bestSellers.map((item, idx) => (
        <Carousel.Item key={idx}>
          <img
            crossOrigin="anonymous"
            className="d-block w-100 img-fluid bannerImage  "
            style={{
              height: "300px",
              objectFit: "cover",
              width: "auto",
              margin: "auto",
              display: "block",
              
            }}
            src={item.images ? item.images[0].path : null}
            alt="First slide"
          />
          <Carousel.Caption>
            <LinkContainer style={cursorP} to={`/product-details/${item._id}`}>
              <h3 className="fontDesign">
                Bestseller in {item.category} Category
              </h3>
            </LinkContainer>
            <p className="paraDesign" style={{ color: "black" }}>
              {item.description.substring(0,160)}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : null;
};

export default ProductCarouselComponent;
