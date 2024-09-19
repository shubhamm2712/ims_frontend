import { Alert, Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { Customer, Transaction } from "../../models/models";
import { useEffect, useState } from "react";
import { apiCall } from "../../utils/apiCall";

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  transaction: Transaction;
  changeTransaction: (transaction: Transaction) => void;
}

function SelectCustomer({
  onPrevious,
  onNext,
  transaction,
  changeTransaction,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState(transaction);
  const [currentAlert, setCurrentAlert] = useState("");

  const validate_form = () => {
    if (
      selectedCustomer.customerId === undefined ||
      selectedCustomer.customerId === 0 ||
      selectedCustomer.customerId < -1
    ) {
      setCurrentAlert("No customer selected");
      return false;
    }
    if (
      selectedCustomer.customerId === -1 &&
      selectedCustomer.name === undefined
    ) {
      setCurrentAlert("Customer name not entered");
      return false;
    } else if (
      selectedCustomer.customerId === -1 &&
      selectedCustomer.name !== undefined
    ) {
      selectedCustomer.name = selectedCustomer.name.trim();
      if (!selectedCustomer.name) {
        setCurrentAlert("Customer name not entered");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validate_form()) {
      changeTransaction(selectedCustomer);
      onNext();
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiCall<Customer[]>(
          "GET",
          "/customers/get_all_customers"
        );
        if (response.success && Array.isArray(response.data)) {
          setCustomers(
            response.data.sort((a: Customer, b: Customer) => {
              if (a.id && b.id && a.id < b.id) {
                return 1;
              }
              return -1;
            })
          );
        } else if (
          typeof response.data === "object" &&
          "detail" in response.data
        ) {
          setCurrentAlert(response.data["detail"]);
        }
      } catch (error) {
        setCurrentAlert("Check console for errors");
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <>
      {currentAlert && (
        <Alert
          className="alert alert-danger"
          onClose={() => {
            setCurrentAlert("");
          }}
          dismissible
        >
          {currentAlert}
        </Alert>
      )}
      <h2 className="mt-2 mb-2">Select Customer</h2>

      <Form.Group>
        <ListGroup>
          {customers.map((customer) => (
            <ListGroup.Item
              key={customer.id}
              onClick={() => {
                setSelectedCustomer({
                  ...selectedCustomer,
                  customerId: customer.id,
                  name: customer.name,
                  customerAddress: customer.address,
                  customerPhone: customer.phone,
                  customerTaxNumber: customer.taxNumber,
                  customerMetaData: customer.metaData,
                });
              }}
            >
              <Row>
                <Col xs={1} className="d-flex align-items-center">
                  <Form.Check
                    type="radio"
                    checked={selectedCustomer.customerId === customer.id}
                    onChange={() => {}}
                  ></Form.Check>
                </Col>
                <Col>
                  <Row>
                    <Col sm={6}>
                      <strong>Name:</strong>
                      {" " + customer.name}
                    </Col>
                    <Col sm={6}>
                      <strong>Address: </strong>
                      {customer.address}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
          <ListGroup.Item
            key={-1}
            onClick={() => {
              setSelectedCustomer({
                ...selectedCustomer,
                customerId: -1,
                name: "",
                customerAddress: "",
                customerMetaData: "",
                customerPhone: "",
                customerTaxNumber: "",
              });
            }}
          >
            <Row>
              <Col xs={1} className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  checked={selectedCustomer.customerId === -1}
                  onChange={() => {}}
                ></Form.Check>
              </Col>
              <Col>
                <Row>
                  <strong>Add new customer</strong>
                </Row>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Form.Group>

      {selectedCustomer.customerId === -1 && (
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="New Customer Name"
            value={selectedCustomer.name}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                name: e.target.value,
              })
            }
            className="mt-3 mb-2"
          />
          <Form.Control
            as="textarea"
            placeholder="New Customer Address"
            value={selectedCustomer.customerAddress}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                customerAddress: e.target.value,
              })
            }
            className="mt-2 mb-2"
          />
          <Form.Control
            type="text"
            placeholder="New Customer Phone"
            value={selectedCustomer.customerPhone}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                customerPhone: e.target.value,
              })
            }
            className="mt-2 mb-2"
          />
          <Form.Control
            type="text"
            placeholder="New Customer Tax Number"
            value={selectedCustomer.customerTaxNumber}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                customerTaxNumber: e.target.value,
              })
            }
            className="mt-2 mb-2"
          />
          <Form.Control
            type="text"
            placeholder="New Customer MetaData"
            value={selectedCustomer.customerMetaData}
            onChange={(e) =>
              setSelectedCustomer({
                ...selectedCustomer,
                customerMetaData: e.target.value,
              })
            }
            className="mt-2 mb-2"
          />
        </Form.Group>
      )}

      <Form.Group className="mt-4">
        <div className="d-flex">
          <div className="me-auto">
            <Button variant="secondary" type="button" onClick={onPrevious}>
              Back
            </Button>
          </div>
          <div className="ms-auto">
            <Button variant="primary" type="button" onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </Form.Group>
    </>
  );
}

export default SelectCustomer;
