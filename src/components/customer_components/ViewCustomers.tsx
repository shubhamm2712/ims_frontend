import { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Customer } from "../../models/models";
import ViewCustomer from "./ViewCustomer";

// ViewCustomers Component
function ViewCustomers() {
  const [loaderShow, setLoaderShow] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Fetch customers on component mount
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
          setAlertMessage(response.data["detail"]);
        }
        setLoaderShow(false);
      } catch (error) {
        setAlertMessage("Check console for errors");
        console.error("Error fetching customers:", error);
        setLoaderShow(false);
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

  // Handle deletion of selected customers
  const handleDeactivate = async () => {
    setLoaderShow(true);
    try {
      const deactivateCustomers: Customer[] = [];
      selectedCustomers.map((index: number) => {
        deactivateCustomers.push(customers[index]);
      });
      const response = await apiCall<Customer[]>(
        "PUT",
        "/customers/deactivate_customers",
        deactivateCustomers
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
        setAlertMessage(response.data["detail"]);
      }
      setSelectedCustomers([]); // Reset selection
      setLoaderShow(false);
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error disabling customers:", error);
      setLoaderShow(false);
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
        updatable={true}
        updateFunction={(customer: Customer) => {
          setCustomers([
            ...customers.slice(0, index),
            customer,
            ...customers.slice(index + 1),
          ]);
        }}
      ></ViewCustomer>
    );
    setShowCustomer(true);
  };

  const inventoryTable = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Disable</th>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Tax Number</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, index) => (
          <tr key={customer.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedCustomers.includes(index)}
                onChange={() => handleSelect(index)}
                disabled={customer.usedInTransaction != 0}
              />
            </td>
            <td onClick={() => handleCustomerClicked(index)}>
              {customer.name}
            </td>
            <td onClick={() => handleCustomerClicked(index)}>
              {customer.address}
            </td>
            <td onClick={() => handleCustomerClicked(index)}>
              {customer.phone}
            </td>
            <td onClick={() => handleCustomerClicked(index)}>
              {customer.taxNumber}
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
          <h2 className="mt-2">Customers</h2>
          {loaderShow && (
            <Spinner animation="border" className="mt-2">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {!loaderShow && (
            <>
              {showAlert && alertMessage !== "" && alertMessageBox}

              {customers.length > 0 && inventoryTable}
              {customers.length == 0 && (
                <h6 className="mt-2">No customers here</h6>
              )}

              {selectedCustomers.length > 0 && (
                <Button variant="danger" onClick={handleDeactivate}>
                  Disable Selected Customers
                </Button>
              )}
            </>
          )}
        </>
      )}
      {showCustomer && customerToShow}
    </div>
  );
}

export default ViewCustomers;
