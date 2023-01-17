import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Form,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories } from "../redux/actions/categoryActions";


const HeaderComponent = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const { categories } = useSelector((state) => state.getCategories);
   

  const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
     const FavProducts = useSelector((state) => state.wishList.FavProducts);

     

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const submitHandler = (e) => {
     if (e.keyCode && e.keyCode !== 13) return;
     e.preventDefault();
     if (searchQuery.trim()) {
         if (searchCategoryToggle === "All") {
             navigate(`/product-list/search/${searchQuery}`);
         } else {
             navigate(`/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}/search/${searchQuery}`);
         }
     } else if (searchCategoryToggle !== "All") {
         navigate(`/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}`);
     } else {
         navigate("/product-list");
     }
  }

  
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="p-4"
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="/" className="fs-2 fw-bold">
            <i style={{ color: "#FFFF00" }} class="fa-solid fa-trophy"></i> TIME
            TO PLAY
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <InputGroup className="ms-5">
              <DropdownButton
                id="dropdown-basic-button"
                title={searchCategoryToggle}
              >
                <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
                  All
                </Dropdown.Item>
                {categories.map((category, id) => (
                  <Dropdown.Item
                    key={id}
                    onClick={() => setSearchCategoryToggle(category.name)}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control
                onKeyUp={submitHandler}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search in shop ..."
              />
              <Button onClick={submitHandler} variant="warning">
                <i className="bi bi-search text-dark"></i>
              </Button>
            </InputGroup>
          </Nav>
          <Nav>
            {userInfo.isAdmin ? (
              <LinkContainer to="/admin/orders">
                <Nav.Link className="fs-5 fw-bold ms-2">Admin</Nav.Link>
              </LinkContainer>
            ) : userInfo.name && !userInfo.isAdmin ? (
              <NavDropdown
                title={`${userInfo.name} ${userInfo.lastName}`}
                id="collasible-nav-dropdown"
                className="fs-5 fw-bold ms-2"
              >
                <NavDropdown.Item
                  eventKey="/my-orders"
                  as={Link}
                  to="/my-orders"
                >
                  My orders
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="/user" as={Link} to="/user">
                  My profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => dispatch(logout())}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}

            {userInfo.isAdmin ? (
              <>
                <LinkContainer to="/wishlist">
                  <Nav.Link disabled>
                    <Badge pill bg="warning">
                      
                      {FavProducts.length}
                    </Badge>

                    <span className="fs-5 fw-bold ms-2">Wishlist </span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/cart">
                  <Nav.Link disabled>
                    <Badge pill bg="danger">
                      {0}
                    </Badge>
                    <i className="bi bi-cart-dash fs-4 text-primary"></i>
                    <span className="fs-5 fw-bold ms-2">CART</span>
                  </Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
                <LinkContainer to="/wishlist">
                  <Nav.Link>
                    {/* <Badge pill bg="warning">
                      {userInfo.name ? FavProducts.length : 0} 
                    </Badge> */}

                    <span className="fs-5 fw-bold ms-2">Wishlist </span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/cart">
                  <Nav.Link>
                    <Badge pill bg="danger">
                      {itemsCount === 0 ? "" : itemsCount}
                    </Badge>
                    <i className="bi bi-cart-dash fs-4 text-primary"></i>
                    <span className="fs-5 fw-bold ms-2">CART</span>
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
