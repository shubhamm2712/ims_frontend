import { Container, Row, Col, Alert } from "react-bootstrap";

function DashboardHome() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Header */}
          <h1 className="text-center">Welcome to Your Dashboard</h1>
          <p className="text-center">Manage your inventory with ease!</p>

          {/* Instructions */}
          <Alert variant="info" className="mt-4">
            <h5>Getting Started:</h5>
            <ul>
              <li>
                Tap the <strong>☰ (three dashes)</strong> in the top-left to
                reveal the menu and get started.
              </li>
              <li>
                Need to check your stock? Head over to{" "}
                <strong>Products/Inventory</strong>.
              </li>
              <li>
                Time to record a sale or view past transactions? Simply click on{" "}
                <strong>Transactions</strong>.
              </li>
              <li>
                Product quantities can only be updated through a transaction, so
                keep things organized that way!
              </li>
              <li>
                Once a transaction is recorded, it’s locked in —{" "}
                <strong>no take-backs</strong>.
              </li>
              <li>
                Similarly, if a product or customer has been part of a
                transaction, <strong>they can't be removed</strong>.
              </li>
              <li>Enjoy smooth and efficient bookkeeping!</li>
            </ul>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardHome;
