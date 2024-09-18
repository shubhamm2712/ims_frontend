import { Customer } from "../../models/models";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { useState } from "react";
import UpdateCustomer from "./UpdateCustomer";

interface Props {
  customer: Customer;
  backSign?: boolean;
  handleCloseCustomer?: () => void;
  updatable?: boolean;
  updateFunction?: (customer: Customer) => void;
}

function ViewCustomer({
  customer,
  handleCloseCustomer = () => {},
  backSign = true,
  updatable = false,
  updateFunction = () => {},
}: Props) {
  const [useCustomer, setUseCustomer] = useState(customer);
  const [showUpdate, setShowUpdate] = useState(false);

  const updateForm = (
    <UpdateCustomer
      customer={useCustomer}
      onCancel={() => {
        setShowUpdate(false);
      }}
      onUpdated={(customer: Customer) => {
        updateFunction(customer);
        setUseCustomer(customer);
      }}
    ></UpdateCustomer>
  );
  const viewCustomer = (
    <Container className="mt-4">
      {backSign && (
        <>
          <p className="mt-2 mb-2">
            <a
              onClick={handleCloseCustomer}
              style={{ color: "black", cursor: "pointer" }}
            >
              {"< "}Back
            </a>
          </p>
        </>
      )}
      <Card>
        <Card.Header>
          <h4 className="d-flex">
            Customer Details{" "}
            {updatable && (
              <FontAwesomeIcon
                className="ms-auto"
                icon={faPenToSquare}
                onClick={() => {
                  setShowUpdate(true);
                }}
              />
            )}
          </h4>
        </Card.Header>
        <Card.Body>
          <Card.Title className="mb-3">
            <strong>{useCustomer.name}</strong>
          </Card.Title>
          <Row className="ms-5">
            <Col md={6}>
              {useCustomer.address && (
                <Card.Text>
                  <strong>Address:</strong> {useCustomer.address}
                </Card.Text>
              )}
              {useCustomer.phone && (
                <Card.Text>
                  <strong>Phone:</strong> {useCustomer.phone}
                </Card.Text>
              )}
              {useCustomer.usedInTransaction !== undefined && (
                <Card.Text>
                  <strong>Used In Transaction:</strong>{" "}
                  {useCustomer.usedInTransaction ? "Yes" : "No"}
                </Card.Text>
              )}
            </Col>
            <Col md={6}>
              {useCustomer.taxNumber && (
                <Card.Text>
                  <strong>Tax Number:</strong> {useCustomer.taxNumber}
                </Card.Text>
              )}
              {useCustomer.metaData && (
                <Card.Text>
                  <strong>Meta Data:</strong> {useCustomer.metaData}
                </Card.Text>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );

  return (
    <>
      {!showUpdate && viewCustomer}
      {showUpdate && updateForm}
    </>
  );
}

export default ViewCustomer;
