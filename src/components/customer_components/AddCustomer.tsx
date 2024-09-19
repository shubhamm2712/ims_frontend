import { useState } from "react";
import { Alert } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Customer } from "../../models/models";
import ViewCustomer from "./ViewCustomer";

function AddCustomer() {
  const [customerData, setCustomerData] = useState<Customer>({
    name: "",
    address: "",
    phone: "",
    taxNumber: "",
    metaData: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showCustomer, setShowCustomer] = useState(false);
  const [addedCustomer, setAddedCustomer] = useState(customerData);

  const handleChange = (key: string, value: string) => {
    setCustomerData({
      ...customerData,
      [key]: value,
    });
  };

  const validate_form = () => {
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
        setAddedCustomer(response.data);
        setShowCustomer(true);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      setAlertMessage("Check console for errors");
    }
  };

  const form = (
    <>
      <div className="mt-2">
        <h2>Add New Customer</h2>

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

          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Add Customer
          </button>
        </form>
      </div>
    </>
  );

  const addedCustomerView = (
    <ViewCustomer
      customer={addedCustomer}
      backSign={false}
      updatable={true}
      updateFunction={(customer: Customer) => {
        setAddedCustomer(customer);
      }}
    ></ViewCustomer>
  );

  return (
    <>
      {showCustomer && addedCustomerView}
      {!showCustomer && form}
    </>
  );
}

export default AddCustomer;
