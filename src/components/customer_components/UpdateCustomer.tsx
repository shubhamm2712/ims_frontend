import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Customer } from "../../models/models";

interface Props {
  customer: Customer;
  onCancel: () => void;
  onUpdated: (customer: Customer) => void;
}

function UpdateCustomer({ customer, onCancel, onUpdated }: Props) {
  const [customerData, setCustomerData] = useState<Customer>(customer);

  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (key: string, value: string) => {
    setCustomerData({
      ...customerData,
      [key]: value,
    });
  };

  const validate_form = () => {
    if (!customerData.id) {
      setAlertMessage("Id missing or 0");
      return false;
    }
    if (customerData.name) {
      customerData.name = customerData.name.trim();
      if (customerData.name === "") {
        setAlertMessage("Name cannot be empty");
        return false;
      }
    } else {
      setAlertMessage("Name cannot be empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate_form()) {
      return;
    }
    try {
      const response = await apiCall<Customer>(
        "POST",
        "/customers/add_customer",
        customerData
      );
      if (
        response.success &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        onCancel();
        onUpdated(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setAlertMessage("Check console for errors");
    }
  };

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col></Col>
          <Col sm={8}>
            <div>
              <h2>Update Customer</h2>

              {alertMessage && (
                <Alert
                  className="alert alert-danger"
                  onClose={() => {
                    setAlertMessage("");
                  }}
                  dismissible
                >
                  {alertMessage}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={customerData.name || ""}
                    onChange={(event) => {
                      handleChange(event.target.name, event.target.value);
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Customer Address
                  </label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={customerData.address || ""}
                    onChange={(event) => {
                      handleChange(event.target.name, event.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={customerData.phone || ""}
                    onChange={(event) => {
                      handleChange(event.target.name, event.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="taxNumber" className="form-label">
                    Tax Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taxNumber"
                    name="taxNumber"
                    value={customerData.taxNumber || ""}
                    onChange={(event) => {
                      handleChange(event.target.name, event.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="metaData" className="form-label">
                    Metadata
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="metaData"
                    name="metaData"
                    value={customerData.metaData || ""}
                    onChange={(event) => {
                      handleChange(event.target.name, event.target.value);
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Container>
                    <Row>
                      <Col>
                        <label className="form-label">
                          Used in Transactions
                        </label>
                        {": "}
                        <strong>
                          {customer.usedInTransaction == 1 ? "Yes" : "No"}
                        </strong>
                      </Col>
                    </Row>
                  </Container>
                </div>

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                  >
                    Update Customer
                  </button>

                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary ms-3"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default UpdateCustomer;
