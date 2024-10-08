import { useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Customer } from "../../models/models";

interface Props {
  customer: Customer;
  onCancel: () => void;
  onUpdated: (customer: Customer) => void;
}

function UpdateCustomer({ customer, onCancel, onUpdated }: Props) {
  const [loaderShow, setLoaderShow] = useState(false);
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
    setLoaderShow(true);
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
        setLoaderShow(false);
        onCancel();
        onUpdated(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
        setLoaderShow(false);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setAlertMessage("Check console for errors");
      setLoaderShow(false);
    }
  };

  return (
    <>
      {loaderShow && (
        <Spinner animation="border" className="mt-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!loaderShow && (
        <div>
          <h2 className="mt-2">Update Customer</h2>

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
                Customer Name <span style={{ color: "red" }}>*</span>
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
                type="number"
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
                    <label className="form-label">Used in Transactions</label>
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
      )}
    </>
  );
}

export default UpdateCustomer;
