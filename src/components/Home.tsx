import { Col, Container, Navbar, Row } from "react-bootstrap";

import "../css/Home.css";
import Generate from "../utils/generate";

function Home() {
  var login_link = "";

  const verifier = Generate["verifier"];
  const challenge = Generate["challenge"];

  localStorage.setItem("verifier", verifier);

  const url = window.location.href + "callback";

  login_link =
    "https://dev-kz2fpaq4oiht7zgs.us.auth0.com/authorize?response_type=code&code_challenge=" +
    challenge +
    "&code_challenge_method=S256&client_id=yUnBLFVRvSWGNFe8Kt1BxlRBBKf6GFNB&redirect_uri=" +
    url +
    "&audience=https://www.imsystem.com&scope=openid%20profile";

  return (
    <>
      <Navbar
        expand="sm"
        className="bg-body-tertiary"
        bg="primary"
        data-bs-theme="dark"
      >
        <Container fluid>
          <Navbar.Brand href="/">Inventory Management System</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <a href={login_link}>Login / Signup</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        <Row>
          <Col></Col>
          <Col sm={10} className="text-center">
            <h2>Inventory Management System:</h2>
            <br></br>
            <p>
              Our system allows businesses to efficiently track and manage
              product stock, transactions, and order history. Whether you're
              running a small retail store or a large warehouse, this system
              will help you:
            </p>
            <ul>
              <li>Manage product details and stock levels.</li>
              <li>Track sales, purchases, and inventory adjustments.</li>
              <li>Generate insightful reports for better decision-making.</li>
              <li>
                Ensure seamless integration with authentication services for
                secure access.
              </li>
            </ul>
            <br></br>
            <br></br>
            <h4>
              Explore the github repo, to learn more about this project:{" "}
              <a
                href="https://github.com/shubhamm2712/InventoryManagementSystem"
                target="_blank"
                style={{ color: "black" }}
              >
                GitHub Link
              </a>
            </h4>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
