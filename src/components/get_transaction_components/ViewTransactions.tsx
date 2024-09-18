import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Dropdown,
  Container,
  ListGroup,
  Alert,
} from "react-bootstrap";
import {
  Customer,
  Portfolio,
  Product,
  Transaction,
  TransactionItemDetails,
} from "../../models/models";
import { apiCall } from "../../utils/apiCall";
import ViewTransactionList from "./ViewTransactionList";

function ViewTransactions() {
  const [alertMessage, setAlertMessage] = useState("");
  const [filterOption, setFilterOption] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Portfolio>({});
  const [showTransactionsList, setShowTransactionsList] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(
    () => new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const getCustomers = async () => {
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
      } catch (error) {
        setAlertMessage("Check console for errors");
        console.error("Error fetching customers:", error);
      }
    };
    const getProducts = async () => {
      try {
        const response = await apiCall<Product[]>(
          "GET",
          "/products/get_all_products"
        );
        if (response.success && Array.isArray(response.data)) {
          setProducts(
            response.data.sort((a: Product, b: Product) => {
              if (a.quantity && b.quantity && a.quantity < b.quantity) {
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
      } catch (error) {
        setAlertMessage("Check console for errors");
        console.error("Error fetching products:", error);
      }
    };
    getCustomers();
    getProducts();
  }, []);

  const changeFilterOptions = (filterString: string) => {
    if (
      filterString === "all" ||
      filterString === "buy" ||
      filterString === "sell"
    ) {
      setSelectedCustomer(null);
      setSelectedProduct(null);
      setFilterOption(filterString);
    } else if (filterString === "customer") {
      setSelectedProduct(null);
      setFilterOption(filterString);
    } else if (filterString === "product") {
      setSelectedCustomer(null);
      setFilterOption(filterString);
    }
  };

  const handleGetTransactions = async () => {
    // Prepare filters based on selected options
    var url = "/transactions";
    if (filterOption == "all") {
      url += "/get_all_transactions";
    } else if (filterOption == "sell" || filterOption == "buy") {
      url += "/get_transaction_" + filterOption;
    } else if (
      filterOption == "customer" &&
      selectedCustomer &&
      selectedCustomer.id &&
      selectedCustomer.id > 0
    ) {
      url += "/get_transaction_customer/" + selectedCustomer.id.toString();
    } else if (
      filterOption == "product" &&
      selectedProduct &&
      selectedProduct.id &&
      selectedProduct.id > 0
    ) {
      url += "/get_transaction_product/" + selectedProduct.id.toString();
    }
    url += "?start_date=" + startDate + "&end_date=" + endDate;
    try {
      const response = await apiCall<Portfolio>("GET", url);
      if (
        response.success &&
        response.data &&
        "transactionsList" in response.data
      ) {
        if (
          response.data.transactionsList &&
          response.data.transactionsList.length > 0 &&
          "productId" in response.data.transactionsList[0]
        ) {
          setTransactions({
            ...response.data,
            transactionsList: response.data.transactionsList.sort(
              (a: TransactionItemDetails, b: TransactionItemDetails) => {
                if (
                  a.transaction &&
                  a.transaction.date &&
                  b.transaction &&
                  b.transaction.date &&
                  a.transaction.date > b.transaction.date
                ) {
                  return 1;
                }
                return -1;
              }
            ),
          });
          setShowTransactionsList(true);
        } else if (
          response.data.transactionsList &&
          response.data.transactionsList.length > 0 &&
          "date" in response.data.transactionsList[0]
        ) {
          setTransactions({
            ...response.data,
            transactionsList: response.data.transactionsList.sort(
              (a: Transaction, b: Transaction) => {
                if (a.date && b.date && a.date > b.date) {
                  return 1;
                }
                return -1;
              }
            ),
          });
          setShowTransactionsList(true);
        } else if (
          response.data.transactionsList &&
          response.data.transactionsList.length == 0
        ) {
          setTransactions(response.data);
          setShowTransactionsList(true);
        } else {
          setAlertMessage(
            "Something wrong with the webpage, contact the developer"
          );
        }
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error fetching transactions:", error);
    }
  };

  const form = (
    <Container className="mt-4">
      <Row>
        <Col></Col>
        <Col md={10}>
          <div>
            <h2>Get Transactions</h2>
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
            <Form>
              {/* Filter Options */}
              <Form.Group>
                <ListGroup>
                  <ListGroup.Item key={"all"}>
                    <Row onClick={() => changeFilterOptions("all")}>
                      <Col xs={1}>
                        <Form.Check
                          type="radio"
                          name="transactionFilter"
                          value="all"
                          checked={filterOption === "all"}
                          onChange={() => changeFilterOptions("all")}
                        />
                      </Col>
                      <Col>All Transactions</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item key={"buy"}>
                    <Row onClick={() => changeFilterOptions("buy")}>
                      <Col xs={1}>
                        <Form.Check
                          type="radio"
                          name="transactionFilter"
                          value="buy"
                          checked={filterOption === "buy"}
                          onChange={() => changeFilterOptions("buy")}
                        />
                      </Col>
                      <Col>Buy Transactions</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item key={"sell"}>
                    <Row onClick={() => changeFilterOptions("sell")}>
                      <Col xs={1}>
                        <Form.Check
                          type="radio"
                          name="transactionFilter"
                          value="sell"
                          checked={filterOption === "sell"}
                          onChange={() => changeFilterOptions("sell")}
                        />
                      </Col>
                      <Col>Sell Transactions</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item key={"customer"}>
                    <Row>
                      <Col
                        xs={1}
                        onClick={() => changeFilterOptions("customer")}
                      >
                        <Form.Check
                          type="radio"
                          name="transactionFilter"
                          value="customer"
                          checked={filterOption === "customer"}
                          onChange={() => changeFilterOptions("customer")}
                        />
                      </Col>
                      <Col
                        md={3}
                        onClick={() => changeFilterOptions("customer")}
                      >
                        Customer Specific
                      </Col>
                      <Col>
                        <Dropdown onClick={() => {}}>
                          <Dropdown.Toggle
                            variant="secondary"
                            style={{ width: "100%" }}
                            disabled={filterOption !== "customer"}
                          >
                            {selectedCustomer
                              ? selectedCustomer.name
                              : "Select Customer"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ width: "100%" }}>
                            {customers.map((customer) => (
                              <Dropdown.Item
                                key={customer.id}
                                onClick={() => {
                                  if (customer.id) {
                                    setSelectedCustomer(customer);
                                  }
                                }}
                              >
                                {customer.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item key={"product"}>
                    <Row>
                      <Col
                        xs={1}
                        onClick={() => changeFilterOptions("product")}
                      >
                        <Form.Check
                          type="radio"
                          name="transactionFilter"
                          value="product"
                          checked={filterOption === "product"}
                          onChange={() => changeFilterOptions("product")}
                        />
                      </Col>
                      <Col
                        md={3}
                        onClick={() => changeFilterOptions("product")}
                      >
                        Product Specific
                      </Col>
                      <Col>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="secondary"
                            style={{ width: "100%" }}
                            disabled={filterOption !== "product"}
                          >
                            {selectedProduct
                              ? selectedProduct.name
                              : "Select Product"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ width: "100%" }}>
                            {products.map((product) => (
                              <Dropdown.Item
                                key={product.id}
                                onClick={() => {
                                  if (product.id) {
                                    setSelectedProduct(product);
                                  }
                                }}
                              >
                                <Row>
                                  <Col>
                                    <strong>Name:</strong> {product.name}
                                  </Col>
                                  <Col>
                                    <strong>Type:</strong> {product.type}
                                  </Col>
                                </Row>
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Form.Group>

              {/* Date Range */}
              <Form.Group className="mt-3">
                <Row>
                  <Col>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Form.Text className="text-muted">
                  * By default, the date range covers the last one month.
                </Form.Text>
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                onClick={handleGetTransactions}
                className="mt-3"
              >
                Get Transactions
              </Button>
            </Form>
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );

  const transactionList = (
    <ViewTransactionList
      portfolio={transactions}
      onBack={() => {
        setShowTransactionsList(false);
        setTransactions({});
        changeFilterOptions("all");
      }}
    ></ViewTransactionList>
  );

  return (
    <>
      {!showTransactionsList && form}
      {showTransactionsList && transactionList}
    </>
  );
}

export default ViewTransactions;
