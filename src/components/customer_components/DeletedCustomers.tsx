import { useEffect, useState } from "react";
import { Table, Button, Alert, Stack } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Customer } from "../../models/models";
import ViewCustomer from "./ViewCustomer";

function DeletedCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [recoverSelectedCustomers, setRecoverSelectedCustomers] = useState<
    number[]
  >([]);
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiCall<Customer[]>(
          "GET",
          "/customers/get_deleted_customers"
        );
        if (response.success && Array.isArray(response.data)) {
          setCustomers(response.data);
        } else if (
          typeof response.data === "object" &&
          "detail" in response.data
        ) {
          setAlertMessage(response.data["detail"]);
        }
      } catch (error) {
        setAlertMessage("Check console for errors");
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Handle customer selection for deletion
  const handleSelect = (id: number) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(
        selectedCustomers.filter((customerId) => customerId !== id)
      );
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  // Handle customer selection for recovery
  const handleSelectRecover = (id: number) => {
    if (recoverSelectedCustomers.includes(id)) {
      setRecoverSelectedCustomers(
        recoverSelectedCustomers.filter((customerId) => customerId !== id)
      );
    } else {
      setRecoverSelectedCustomers([...recoverSelectedCustomers, id]);
    }
  };

  // Handle deletion of selected customers
  const handleDelete = async () => {
    try {
      const deleteCustomers: Customer[] = [];
      selectedCustomers.map((index: number) => {
        deleteCustomers.push(customers[index]);
      });
      const response = await apiCall<Customer[]>(
        "DELETE",
        "/customers/delete_customers",
        deleteCustomers
      );
      if (response.success && Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
      setSelectedCustomers([]); // Reset selection
      setRecoverSelectedCustomers([]);
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error deleting customers:", error);
    }
  };

  // Handle recover of selected customers
  const handleRecover = async () => {
    try {
      const enableCustomers: Customer[] = [];
      recoverSelectedCustomers.map((index: number) => {
        enableCustomers.push(customers[index]);
      });
      const response = await apiCall<Customer[]>(
        "PUT",
        "/customers/recover_customers",
        enableCustomers
      );
      if (response.success && Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
      setSelectedCustomers([]); // Reset selection
      setRecoverSelectedCustomers([]);
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error deleting customers:", error);
    }
  };

  const [showAlert, setShowAlert] = useState(true);
  const alertMessageBox = (
    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
      {alertMessage}
    </Alert>
  );

  const [showCustomer, setShowCustomer] = useState(false);
  const [customerToShow, setCustomerToShow] = useState(<></>);

  const handleCustomerClicked = (index: number) => {
    setCustomerToShow(
      <ViewCustomer
        customer={customers[index]}
        handleCloseCustomer={() => {
          setShowCustomer(false);
          setCustomerToShow(<></>);
        }}
        backSign={true}
      ></ViewCustomer>
    );
    setShowCustomer(true);
  };

  const disabledTable = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th style={{ width: "10%" }}>Recover</th>
          <th>Name</th>
          <th>Address</th>
          <th style={{ width: "10%" }}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, index) => (
          <tr key={customer.id}>
            <td>
              <input
                type="checkbox"
                checked={recoverSelectedCustomers.includes(index)}
                onChange={() => handleSelectRecover(index)}
              />
            </td>
            <td onClick={() => handleCustomerClicked(index)}>
              {customer.name}
            </td>
            <td onClick={() => handleCustomerClicked(index)}>
              {customer.address}
            </td>
            <td>
              <input
                type="checkbox"
                checked={selectedCustomers.includes(index)}
                onChange={() => handleSelect(index)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <div>
      {!showCustomer && (
        <>
          <h2 className="mt-2">Disabled Customers</h2>
          {showAlert && alertMessage !== "" && alertMessageBox}

          {customers.length > 0 && disabledTable}
          {customers.length == 0 && <h6 className="mt-2">No customers here</h6>}

          <Stack direction="horizontal" gap={2}>
            {recoverSelectedCustomers.length > 0 && (
              <div>
                <Button variant="primary" onClick={handleRecover}>
                  Enable Selected Customers
                </Button>
              </div>
            )}
            {selectedCustomers.length > 0 && (
              <div className="ms-auto">
                <Button variant="danger" onClick={handleDelete}>
                  Permanently Delete Selected Customers
                </Button>
              </div>
            )}
          </Stack>
        </>
      )}
      {showCustomer && customerToShow}
    </div>
  );
}

export default DeletedCustomers;
