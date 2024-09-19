import { Alert, Button, Form } from "react-bootstrap";
import { Transaction } from "../../models/models";
import { useState } from "react";

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  alertMessage: string;
  setAlertMessage: (msg: string) => void;
  transaction: Transaction;
  changeTransaction: (transaction: Transaction) => void;
}

function TransactionForm({
  onPrevious,
  onNext,
  alertMessage,
  setAlertMessage,
  transaction,
  changeTransaction,
}: Props) {
  const [currentAlert, setCurrentAlert] = useState("");

  const validate_transaction = () => {
    if (
      transaction.invoiceNumber === undefined ||
      transaction.invoiceNumber.trim() === ""
    ) {
      setCurrentAlert("Invalid Invoice Number");
      return false;
    }
    if (transaction.date === undefined || transaction.date === "") {
      setCurrentAlert("Invalid Date");
      return false;
    }
    if (isNaN(new Date(transaction.date).getDate())) {
      setCurrentAlert("Invalid Date");
      return false;
    }
    if (transaction.totalAmount === undefined || transaction.totalAmount <= 0) {
      setCurrentAlert("Invalid Total Amount");
      return false;
    }
    if (transaction.buyOrSell !== "BUY" && transaction.buyOrSell !== "SELL") {
      setCurrentAlert("Invalid Transaction Type");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validate_transaction()) {
      onNext();
    }
  };

  const handleChange = (key: string, value: string) => {
    changeTransaction({
      ...transaction,
      [key]: value,
    });
  };

  return (
    <>
      <h2 className="mt-2">Transaction Details</h2>
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
      <Form className="mt-2">
        <Form.Group controlId="invoiceNumber">
          <Form.Label>Invoice Number</Form.Label>
          <Form.Control
            type="input"
            name="invoiceNumber"
            value={transaction.invoiceNumber}
            onChange={(event) => {
              handleChange(event.target.name, event.target.value);
            }}
            required
          />
        </Form.Group>

        <Form.Group controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={transaction.date}
            onChange={(event) => {
              handleChange(event.target.name, event.target.value);
            }}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={transaction.description}
            onChange={(event) => {
              handleChange(event.target.name, event.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="metaData">
          <Form.Label>Metadata</Form.Label>
          <Form.Control
            as="input"
            name="metaData"
            value={transaction.metaData}
            onChange={(event) => {
              handleChange(event.target.name, event.target.value);
            }}
          />
        </Form.Group>

        <Form.Group controlId="totalAmount">
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="number"
            name="totalAmount"
            placeholder="0"
            value={transaction.totalAmount == 0 ? "" : transaction.totalAmount}
            onChange={(event) => {
              handleChange(event.target.name, event.target.value);
            }}
            required
          />
        </Form.Group>

        <Form.Group controlId="buyOrSell">
          <Form.Label>Transaction Type</Form.Label>
          <Form.Control
            as="select"
            name="buyOrSell"
            value={transaction.buyOrSell}
            onChange={(event) => {
              handleChange(event.target.name, event.target.value);
            }}
          >
            <option value="">Select Type</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mt-4 mb-4">
          <div className="d-flex">
            <div className="me-auto">
              <Button variant="secondary" type="button" onClick={onPrevious}>
                Cancel
              </Button>
            </div>
            <div className="ms-auto">
              <Button variant="primary" type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        </Form.Group>
      </Form>
    </>
  );
}

export default TransactionForm;
