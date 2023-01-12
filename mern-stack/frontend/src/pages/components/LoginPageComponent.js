import { Container, Row, Col, Form, Button, Alert,Card,Image } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";




const LoginPageComponent = ({
  loginUserApiRequest,
  reduxDispatch,
  setReduxUserState,
}) => {
  const [validated, setValidated] = useState(false);
  const [loginUserResponseState, setLoginUserResponseState] = useState({
    success: "",
    error: "",
    loading: false,
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const email = form.email.value;
    const password = form.password.value;
    const doNotLogout = form.doNotLogout.checked;

    if (event.currentTarget.checkValidity() === true && email && password) {
      setLoginUserResponseState({ loading: true });
      loginUserApiRequest(email, password, doNotLogout)
        .then((res) => {
          setLoginUserResponseState({
            success: res.success,
            loading: false,
            error: "",
          });

          if (res.userLoggedIn) {
            reduxDispatch(setReduxUserState(res.userLoggedIn));
          }

          if (res.success === "user logged in" && !res.userLoggedIn.isAdmin)
            window.location.assign("/");
          else window.location.assign("/admin/orders");
        })
        .catch((er) => {
          console.log("err", er.response.data);
          setLoginUserResponseState({
            error: er.response.data.message
              ? er.response.data.message
              : er.response.data,
          });
          console.log("345", loginUserResponseState);
        });
    }

    setValidated(true);
  };

  return (
    <div className="loginPage">
      <div className="d-flex flex-row mt-2  centers">
        <i
          class="fa-solid fa-trophy"
          style={{ fontSize: "50px", color: "yellow" }}
        ></i>
        <span className="h1 fw-bold mb-3 ms-3" style={{ color: "darkorange" }}>
          TIME TO PLAY
        </span>
      </div>
      <Row className="g-0">
        <Col md={5}>
          <Image
            src="https://cdn.graciousquotes.com/wp-content/uploads/2021/09/Dont-stop-chasing-your-dreams-because-dreams-do-come-true..jpg"
            alt="login form"
            className="rounded-start w-100 "
            height={"100%"}
          />
        </Col>

        <Col md={1}></Col>

        <Col md={6}>
          <Card.Body className="d-flex flex-column mt-4">
            <h2 className="mt-3">
              {" "}
              <span>
                <i class="fa-solid fa-users me-4 fs-1" style={{color:"orange"}}></i>Login{" "}
              </span>{" "}
            </h2>

            <br></br>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <br></br>
                <Form.Control
                  name="email"
                  required
                  type="email"
                  placeholder="Enter email"
                  style={{ width: "70%" }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <br></br>
                <Form.Control
                  name="password"
                  required
                  type="password"
                  placeholder="Password"
                  style={{ width: "70%" }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  name="doNotLogout"
                  type="checkbox"
                  label="Do not logout"
                />
              </Form.Group>

              <Row className="pb-2">
                <Link to={"/forgotPassword"}> Forgot Password </Link>
              </Row>

              <Row className="pb-2">
                <br></br>
                <Col>
                  Don't you have an account?{" "}
                  <Link to={"/register"}> Register </Link>
                </Col>
              </Row>
              <br></br>
              <Button variant="primary" type="submit" className="mb-4">
                {loginUserResponseState &&
                loginUserResponseState.loading === true ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  ""
                )}
                Login
              </Button>
              <Alert
                className="mt-3"
                show={
                  loginUserResponseState &&
                  loginUserResponseState.error === "wrong credentials"
                }
                variant="danger"
              >
                Wrong credentials
              </Alert>
            </Form>
          </Card.Body>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPageComponent;
