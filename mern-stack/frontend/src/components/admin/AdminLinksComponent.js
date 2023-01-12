import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { logout } from "../../redux/actions/userActions";
import { useDispatch } from "react-redux";

const AdminLinksComponent = () => {
    const dispatch = useDispatch()
  return (
    <Navbar
      bg="success"
      variant="light"
      className="text-white fs-4 fw-2 border border-primary  border-5 "
    >
      <Nav className="flex-column">
        <LinkContainer to="/admin/orders">
          <Nav.Link className="text-white border-3">
            <span className="ms-3"></span>Orders
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/products">
          <Nav.Link className="text-white">
            <span className="ms-3"></span>Products
          </Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/users">
          <Nav.Link className="text-white">
            <span className="ms-3"></span>Users
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/admin/coupon">
          <Nav.Link className="text-white">
            <span className="ms-3"></span>Coupons
          </Nav.Link>
        </LinkContainer>

        <LinkContainer to="/admin/analytics">
          <Nav.Link className="text-white">
            <span className="ms-3"></span>Analytics
          </Nav.Link>
        </LinkContainer>
        <Nav.Link onClick={() => dispatch(logout())} className="text-white">
          <span className="ms-3"></span> Logout
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default AdminLinksComponent;
