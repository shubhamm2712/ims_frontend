import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import {
  Portfolio,
  Transaction,
  TransactionItemDetails,
} from "../../models/models";
import { apiCall } from "../../utils/apiCall";
import { useState } from "react";
import ViewTransaction from "../add_transaction_components/ViewTransaction";

interface Props {
  portfolio: Portfolio;
  onBack: () => void;
}

function ViewTransactionList({ portfolio, onBack }: Props) {
  const [alertMessage, setAlertMessage] = useState("");
  const [transactionVisible, setTransactionVisible] = useState(false);
  const [transactionToShow, setTransactionToShow] = useState<Transaction>({});

  const showTransaction = async (id: number) => {
    try {
      const response = await apiCall<Transaction>(
        "GET",
        "/transactions/get_transaction/" + id.toString()
      );
      if (
        response.success &&
        typeof response.data == "object" &&
        "id" in response.data
      ) {
        setTransactionToShow(response.data);
        setTransactionVisible(true);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error fetching transaction:", error);
    }
  };

  var transactionTable;
  if (
    portfolio.transactionsList &&
    portfolio.transactionsList.length > 0 &&
    "productId" in portfolio.transactionsList[0]
  ) {
    transactionTable = (
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Product</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.transactionsList.map(
            (transaction: TransactionItemDetails, index: number) => {
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (transaction.transaction && transaction.transaction.id) {
                      showTransaction(transaction.transaction?.id);
                    }
                  }}
                  key={index}
                >
                  <td>{transaction.transaction?.invoiceNumber}</td>
                  <td>{transaction.transaction?.date}</td>
                  <td>{transaction.name}</td>
                  <td>{transaction.transaction?.buyOrSell}</td>
                  <td>{transaction.quantity}</td>
                  <td>
                    ${transaction.rate ? transaction.rate.toFixed(2) : 0.0}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    );
  } else if (
    portfolio.transactionsList &&
    portfolio.transactionsList.length > 0 &&
    "date" in portfolio.transactionsList[0]
  ) {
    transactionTable = (
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.transactionsList.map(
            (transaction: Transaction, index: number) => {
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (transaction.id) {
                      showTransaction(transaction.id);
                    }
                  }}
                  key={index}
                >
                  <td>{transaction.invoiceNumber}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.name}</td>
                  <td>{transaction.buyOrSell}</td>
                  <td>
                    $
                    {transaction.totalAmount
                      ? transaction.totalAmount.toFixed(2)
                      : 0.0}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
    );
  }

  const list = (
    <Container>
      <Row>
        <Col></Col>
        <Col md={10}>
          <p className="mt-2 mb-2">
            <a onClick={onBack} style={{ color: "black", cursor: "pointer" }}>
              {"< "}Back
            </a>
          </p>
          <h2>Transactions</h2>
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
          <h4 className="mt-2">Summary</h4>
          <Row>
            <Col md={6}>
              <Row>
                <Col>
                  <strong>Buy Amount: </strong>
                </Col>
                <Col>
                  $
                  {portfolio.buyAmount
                    ? portfolio.buyAmount.toFixed(2)
                    : "0.00"}
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col>
                  <strong>Sell Amount: </strong>
                </Col>
                <Col>
                  $
                  {portfolio.sellAmount
                    ? portfolio.sellAmount.toFixed(2)
                    : "0.00"}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Row>
                <Col>
                  <strong>Start Date: </strong>
                </Col>
                <Col>{portfolio.startDate}</Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col>
                  <strong>End Date: </strong>
                </Col>
                <Col>{portfolio.endDate}</Col>
              </Row>
            </Col>
          </Row>
          {portfolio.transactionsList &&
            portfolio.transactionsList.length > 0 &&
            transactionTable}
          {(!portfolio.transactionsList ||
            portfolio.transactionsList.length == 0) && (
            <h6 className="mt-2">No transactions here</h6>
          )}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );

  const one = (
    <ViewTransaction
      transaction={transactionToShow}
      backSign
      onBackSign={() => {
        setTransactionVisible(false);
        setTransactionToShow({});
      }}
    ></ViewTransaction>
  );

  return (
    <div className="mt-2">
      {!transactionVisible && list}
      {transactionVisible && one}
    </div>
  );
}

export default ViewTransactionList;
