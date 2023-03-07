import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { newUserRegistration } from "./userRegAction";
import { useDispatch, useSelector } from "react-redux";

// Počáteční stav registračního formuláře

const initialState = {
  name: "Prem Acharya",
  phone: "0410000000",
  email: "fakeemail@email.com",
  company: "Dented Code",
  address: "George st Sydney",
  password: "sfsd#3Dsg",
  confirmPass: "sfsd#3Dsg",
};

// Počáteční stav chybových hlášek pro ověření hesla

const passVerificationError = {
  isLenthy: false,
  hasUpper: false,
  hasLower: false,
  hasNumber: false,
  hasSpclChr: false,
  confirmPass: false,
};

// Definice komponenty RegisterForm

const RegisterForm = () => {
    // Definice stavu pro novou registraci uživatele a chyby hesla
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState(initialState);
  const [passwordError, setPasswordError] = useState(passVerificationError);

  // Výběr stavu souvisejícího s registrací z Redux store
  const { isLoading, status, message } = useSelector(
    (state) => state.registration
  );

  // Definice vedlejšího efektu pro změny v newUser stavu (v současnosti prázdné)
  useEffect(() => {}, [newUser]);

  // Definice funkce pro zachytávání změn vstupů formuláře
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // Aktualizace newUser stavu
    setNewUser({ ...newUser, [name]: value });

    // Pokud se jedná o jméno vstupu "password", ověří se síla hesla
    if (name === "password") {
      const isLenthy = value.length > 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpclChr = /[@,#,$,%,&,.]/.test(value);

      // Aktualizace passwordError stavu
      setPasswordError({
        ...passwordError,
        isLenthy,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpclChr,
      });
    }

    // Pokud se jedná o jméno vstupu "confirmPass", ověří se, zda se shoduje s heslem
    if (name === "confirmPass") {
      setPasswordError({
        ...passwordError,
        confirmPass: newUser.password === value,
      });
    }
  };

  // Definice funkce pro odeslání formuláře
  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(newUser);
    const { name, phone, email, company, address, password } = newUser;

    const newRegistration = {
      name,
      phone,
      email,
      company,
      address,
      password,
    };
    dispatch(newUserRegistration(newRegistration));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-info">User Registration</h1>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          {message && (
            <Alert variant={status === "success" ? "success" : "danger"}>
              {message}
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <Form onSubmit={handleOnSubmit}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleOnChange}
                placeholder="Your name"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                name="phone"
                value={newUser.phone}
                onChange={handleOnChange}
                placeholder="Phone"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleOnChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Company name</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={newUser.company}
                onChange={handleOnChange}
                placeholder="Company name"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleOnChange}
                placeholder="Full address"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleOnChange}
                placeholder="Password"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPass"
                value={newUser.confirmPass}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                required
              />
            </Form.Group>
            <Form.Text>
              {!passwordError.confirmPass && (
                <div className="text-danger mb-3">Password doesn't match!</div>
              )}
            </Form.Text>

            <ul className="mb-4">
              <li
                className={
                  passwordError.isLenthy ? "text-success" : "text-danger"
                }
              >
                Min 8 characters
              </li>
              <li
                className={
                  passwordError.hasUpper ? "text-success" : "text-danger"
                }
              >
                At least one upper case
              </li>
              <li
                className={
                  passwordError.hasLower ? "text-success" : "text-danger"
                }
              >
                At least one lower case
              </li>
              <li
                className={
                  passwordError.hasNumber ? "text-success" : "text-danger"
                }
              >
                At least one number
              </li>
              <li
                className={
                  passwordError.hasSpclChr ? "text-success" : "text-danger"
                }
              >
                At least on of the special characters i.e @ # $ % & .{" "}
              </li>
            </ul>

            <Button
              variant="primary"
              type="submit"
              disabled={Object.values(passwordError).includes(false)}
            >
              Submit
            </Button>
            {isLoading && <Spinner variant="info" animation="border" />}
          </Form>
        </Col>
      </Row>
      <Row className="py-4">
        <Col>
          Already have an account <a href="/login">Login Now</a>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;