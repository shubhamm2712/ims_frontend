import { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  ListGroup,
  Navbar,
  Offcanvas,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DashboardHome from "./DashboardHome";
import Inventory from "./product_components/Inventory";
import AddProduct from "./product_components/AddProduct";
import DeletedProducts from "./product_components/DeletedProducts";
import AddCustomer from "./customer_components/AddCustomer";
import ViewCustomers from "./customer_components/ViewCustomers";
import DeletedCustomers from "./customer_components/DeletedCustomers";
import AddTransaction from "./add_transaction_components/AddTransaction";
import ViewTransactions from "./get_transaction_components/ViewTransactions";

interface customPayload {
  nickname: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    navigate("/");
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    if (!storedAccessToken) {
      navigate("/");
    }
    const storedIdToken = localStorage.getItem("idToken");
    if (storedIdToken) {
      setUsername(jwtDecode<customPayload>(storedIdToken).nickname);
    } else {
      navigate("/");
    }
  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const productMenu = [
    {
      menuItem: "View Inventory",
      menuIndex: 0,
      component: <Inventory></Inventory>,
    },
    {
      menuItem: "Add Product",
      menuIndex: 1,
      component: <AddProduct></AddProduct>,
    },
    {
      menuItem: "Disabled Products",
      menuIndex: 2,
      component: <DeletedProducts></DeletedProducts>,
    },
  ];
  const customerMenu = [
    {
      menuItem: "Add Customer",
      menuIndex: 4,
      component: <AddCustomer></AddCustomer>,
    },
    {
      menuItem: "View Customers",
      menuIndex: 5,
      component: <ViewCustomers></ViewCustomers>,
    },
    {
      menuItem: "Disabled Customers",
      menuIndex: 6,
      component: <DeletedCustomers></DeletedCustomers>,
    },
  ];
  const transactionMenu = [
    {
      menuItem: "Add Transaction",
      menuIndex: 7,
      component: <AddTransaction></AddTransaction>,
    },
    {
      menuItem: "View Transactions",
      menuIndex: 8,
      component: <ViewTransactions></ViewTransactions>,
    },
  ];

  const [productMenuSelected, setProductMenuSelected] = useState(false);
  const [customerMenuSelected, setCustomerMenuSelected] = useState(false);
  const [transactionsMenuSelected, setTransactionMenuSelected] =
    useState(false);

  const [menuIndexSelected, setMenuSelectedIndex] = useState(-1);
  const [selectedComponent, setSelectedComponent] = useState(
    <DashboardHome></DashboardHome>
  );

  const clickedMenuItem = (
    setSelected: (value: boolean) => void,
    value: boolean
  ) => {
    setProductMenuSelected(false);
    setCustomerMenuSelected(false);
    setTransactionMenuSelected(false);
    setSelected(!value);
  };

  const handleMenuChange = (index: number, component: ReactElement) => {
    if (index != menuIndexSelected) {
      setMenuSelectedIndex(index);
      setSelectedComponent(component);
    }
    handleClose();
  };

  const productMenuItems = (
    <ListGroup>
      {productMenu.map((item) => {
        return (
          <ListGroup.Item
            action
            key={item.menuIndex}
            className={
              item.menuIndex == menuIndexSelected ? "active ps-5" : "ps-5"
            }
            onClick={() => handleMenuChange(item.menuIndex, item.component)}
          >
            {item.menuItem}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );

  const customerMenuItems = (
    <ListGroup>
      {customerMenu.map((item) => {
        return (
          <ListGroup.Item
            action
            key={item.menuIndex}
            className={
              item.menuIndex == menuIndexSelected ? "active ps-5" : "ps-5"
            }
            onClick={() => handleMenuChange(item.menuIndex, item.component)}
          >
            {item.menuItem}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );

  const transactionMenuItems = (
    <ListGroup>
      {transactionMenu.map((item) => {
        return (
          <ListGroup.Item
            action
            key={item.menuIndex}
            className={
              item.menuIndex == menuIndexSelected ? "active ps-5" : "ps-5"
            }
            onClick={() => handleMenuChange(item.menuIndex, item.component)}
          >
            {item.menuItem}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="primary"
        data-bs-theme="dark"
        fixed="top"
      >
        <Container fluid>
          <Navbar.Brand href="" onClick={handleLogout}>
            Inventory Management System
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Hi! {username}
              <a href="" onClick={handleLogout} className="ms-3">
                Logout
              </a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5 pt-3" fluid>
        <Row>
          <Col>
            <Button variant="outline-dark" className="" onClick={handleShow}>
              ☰
            </Button>
            <Offcanvas
              show={show}
              onHide={handleClose}
              // responsive="md"
              placement="start"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title className="mt-2">Dashboard</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="mt-2 ps-0 pe-0">
                <ListGroup>
                  <ListGroup.Item
                    action
                    onClick={() =>
                      clickedMenuItem(
                        setProductMenuSelected,
                        productMenuSelected
                      )
                    }
                  >
                    Products / Inventory
                  </ListGroup.Item>
                  {productMenuSelected && productMenuItems}
                  <ListGroup.Item
                    action
                    onClick={() =>
                      clickedMenuItem(
                        setCustomerMenuSelected,
                        customerMenuSelected
                      )
                    }
                  >
                    Customers
                  </ListGroup.Item>
                  {customerMenuSelected && customerMenuItems}
                  <ListGroup.Item
                    action
                    onClick={() =>
                      clickedMenuItem(
                        setTransactionMenuSelected,
                        transactionsMenuSelected
                      )
                    }
                  >
                    Transactions
                  </ListGroup.Item>
                  {transactionsMenuSelected && transactionMenuItems}
                </ListGroup>
              </Offcanvas.Body>
            </Offcanvas>
          </Col>
          <Col lg={10}>{selectedComponent}</Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
