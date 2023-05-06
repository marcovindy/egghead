import React from "react";
import { Row, Col, Button, Container, Image } from "react-bootstrap";
import { Discord, Github } from 'react-bootstrap-icons';
import Logo from "../../assets/images/trivia.png";

const Footer = () => (
  <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 m-0 border-top">
    <Container className="p-0">
      <Row className="justify-content-between container p-2 w-100 mw-100">
        <div className="col-md-4 col-xs-12 d-flex align-items-center mobile-justify-content-center">
          <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
            <Image className='hm-50px' alt="Logo" src={Logo} />
          </a>
          <span className="mb-3 mb-md-0 text-muted">© 2023 Marek Vaníček</span>
        </div>

        <ul className="nav col-md-4 col-xs-12 justify-content-end list-unstyled d-flex mobile-justify-content-center">
          <li className="nav-item me-3">
            <a className="nav-link" href="https://discord.gg/eCXJTQ7EXQ" target="_blank" rel="noreferrer">
              <Discord size={24} />
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="https://github.com/marcovindy/egghead" target="_blank" rel="noreferrer">
              <Github size={24} />
            </a>
          </li>
        </ul>
      </Row>
    </Container>
  </footer>
);

export default Footer;
