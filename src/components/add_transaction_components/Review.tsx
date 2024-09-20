import { Button, Col, ListGroup, Row, Table } from "react-bootstrap";
import { Transaction, TransactionItem } from "../../models/models";

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  transaction: Transaction;
  transactionItems: TransactionItem[];
}

function Review({ onPrevious, onNext, transaction, transactionItems }: Props) {
  return (
    <>
      <h2 className="mt-2">Review Transaction</h2>
      <p className="mb-2">
        Transaction cannot be updated or deleted once added.
      </p>

      <Row>
        <Col>
          <ListGroup>
            <ListGroup.Item key={"invoiceNumber"}>
              <Row>
                <Col md={5}>
                  <strong>Invoice Number:</strong>
                </Col>
                <Col md={7}>{transaction.invoiceNumber}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item key={"date"}>
              <Row>
                <Col md={5}>
                  <strong>Transaction Date:</strong>
                </Col>
                <Col md={7}>{transaction.date}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item key={"name"}>
              <Row>
                <Col md={5}>
                  <strong>Customer Name:</strong>
                </Col>
                <Col md={7}>{transaction.name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item key={"totalAmount"}>
              <Row>
                <Col md={5}>
                  <strong>Total Amount:</strong>
                </Col>
                <Col md={7}>
                  {"$"}
                  {transaction.totalAmount &&
                    Number(transaction.totalAmount).toFixed(2)}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item key={"Type"}>
              <Row>
                <Col md={5}>
                  <strong>Transaction Type:</strong>
                </Col>
                <Col md={7}>{transaction.buyOrSell}</Col>
              </Row>
            </ListGroup.Item>
            {transaction.description && (
              <ListGroup.Item key={"description"}>
                <Row>
                  <Col md={5}>
                    <strong>Description:</strong>
                  </Col>
                  <Col md={7}>{transaction.description}</Col>
                </Row>
              </ListGroup.Item>
            )}
            {transaction.metaData && (
              <ListGroup.Item key={"metadata"}>
                <Row>
                  <Col md={5}>
                    <strong>Metadata:</strong>
                  </Col>
                  <Col md={7}>{transaction.metaData}</Col>
                </Row>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>

      <h3 className="mt-4">Products</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {transactionItems.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{"$" + (item.rate && Number(item.rate).toFixed(2))}</td>
              <td>
                {item.quantity &&
                  item.rate &&
                  "$" + (item.quantity * item.rate).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onPrevious}>
          Edit
        </Button>
        <Button variant="primary" onClick={onNext}>
          Confirm Transaction
        </Button>
      </div>
    </>
  );
}

export default Review;
