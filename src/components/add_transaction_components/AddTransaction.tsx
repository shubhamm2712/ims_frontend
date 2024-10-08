import { useState } from "react";
import TransactionForm from "./TransactionForm";
import SelectCustomer from "./SelectCustomer";
import SelectProduct from "./SelectProduct";
import Review from "./Review";
import {
  Customer,
  Product,
  Transaction,
  TransactionItem,
} from "../../models/models";
import ViewTransaction from "./ViewTransaction";
import { apiCall } from "../../utils/apiCall";
import { Spinner } from "react-bootstrap";

function AddTransaction() {
  const [loaderShow, setLoaderShow] = useState(false);
  const emptyTransaction: Transaction = {
    invoiceNumber: "",
    date: "",
    description: "",
    metaData: "",
    customerId: 0,
    name: "",
    totalAmount: 0,
    buyOrSell: "",
    customerAddress: "",
    customerPhone: "",
    customerMetaData: "",
    customerTaxNumber: "",
  };
  const [alertMessage, setAlertMessage] = useState("");
  const [viewTransactionPage, setViewTransactionPage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transaction, setTransaction] = useState<Transaction>(emptyTransaction);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>(
    []
  );

  const onPrevious = (index: number) => {
    if (index == 0) {
      setTransaction(emptyTransaction);
    } else if (index == 1) {
      setTransaction({
        ...transaction,
        customerId: 0,
        name: "",
        customerAddress: "",
        customerPhone: "",
        customerMetaData: "",
        customerTaxNumber: "",
      });
      setCurrentStep(0);
    } else if (index == 2) {
      setTransactionItems([]);
      setCurrentStep(1);
    } else {
      setCurrentStep(2);
    }
  };

  const clickedSubmit = async () => {
    setLoaderShow(true);
    try {
      var flag = false;
      if (transaction.customerId === -1) {
        const response = await apiCall<Customer>(
          "POST",
          "/customers/add_customer",
          {
            name: transaction.name,
            address: transaction.customerAddress,
            phone: transaction.customerPhone,
            taxNumber: transaction.customerTaxNumber,
            metaData: transaction.customerMetaData,
          }
        );
        if (
          response.success &&
          typeof response.data === "object" &&
          "id" in response.data
        ) {
          transaction.customerId = response.data.id;
        } else if (
          typeof response.data === "object" &&
          "detail" in response.data
        ) {
          setAlertMessage(response.data["detail"]);
          setTransaction(emptyTransaction);
          setTransactionItems([]);
          setCurrentStep(0);
          flag = true;
        }
      }
      for (var index = 0; index < transactionItems.length; index += 1) {
        if (transactionItems[index].productId === -1 && !flag) {
          const response = await apiCall<Product>(
            "POST",
            "/products/add_product",
            {
              name: transactionItems[index].name,
              type: transactionItems[index].productType,
              subtype: transactionItems[index].productSubtype,
              description: transactionItems[index].productDescription,
              metaData: transactionItems[index].productMetaData,
            }
          );
          if (
            response.success &&
            typeof response.data === "object" &&
            "id" in response.data
          ) {
            transactionItems[index].productId = response.data.id;
          } else if (
            typeof response.data === "object" &&
            "detail" in response.data
          ) {
            setAlertMessage(response.data["detail"]);
            setTransaction(emptyTransaction);
            setTransactionItems([]);
            setCurrentStep(0);
            flag = true;
          }
        }
      }
      if (!flag) {
        const response = await apiCall<Transaction>(
          "POST",
          "/transactions/add_transaction",
          {
            ...transaction,
            items: transactionItems,
          }
        );
        if (
          response.success &&
          typeof response.data === "object" &&
          "date" in response.data
        ) {
          setTransaction(response.data);
          setViewTransactionPage(true);
        } else if (
          typeof response.data === "object" &&
          "detail" in response.data
        ) {
          setAlertMessage(response.data["detail"]);
          setTransaction(emptyTransaction);
          setTransactionItems([]);
          setCurrentStep(0);
        }
      }
      setLoaderShow(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setAlertMessage("Check console for errors");
      setTransaction(emptyTransaction);
      setTransactionItems([]);
      setCurrentStep(0);
      setLoaderShow(false);
    }
  };

  const form = (
    <>
      {currentStep == 0 && (
        <TransactionForm
          onNext={() => {
            setCurrentStep(1);
          }}
          onPrevious={() => {
            onPrevious(0);
          }}
          alertMessage={alertMessage}
          setAlertMessage={(msg: string) => setAlertMessage(msg)}
          transaction={transaction}
          changeTransaction={(transaction: Transaction) => {
            setTransaction(transaction);
          }}
        ></TransactionForm>
      )}
      {currentStep == 1 && (
        <SelectCustomer
          onNext={() => {
            setCurrentStep(2);
          }}
          onPrevious={() => {
            onPrevious(1);
          }}
          transaction={transaction}
          changeTransaction={(transaction: Transaction) => {
            setTransaction(transaction);
          }}
        ></SelectCustomer>
      )}
      {currentStep == 2 && (
        <SelectProduct
          onNext={() => {
            setCurrentStep(3);
          }}
          onPrevious={() => {
            onPrevious(2);
          }}
          selectedProducts={transactionItems}
          changeSelectedProducts={(items: TransactionItem[]) => {
            setTransactionItems(items);
          }}
          transaction={transaction}
        ></SelectProduct>
      )}
      {currentStep == 3 && (
        <Review
          onNext={() => {
            clickedSubmit();
          }}
          onPrevious={() => {
            onPrevious(3);
          }}
          transaction={transaction}
          transactionItems={transactionItems}
        ></Review>
      )}
    </>
  );

  const viewTransaction = (
    <ViewTransaction transaction={transaction}></ViewTransaction>
  );

  return (
    <>
      {loaderShow && (
        <Spinner animation="border" className="mt-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!loaderShow && !viewTransactionPage && form}
      {!loaderShow && viewTransactionPage && viewTransaction}
    </>
  );
}

export default AddTransaction;
