import { Alert, Button, Form, Spinner, Table } from "react-bootstrap";
import { Product, Transaction, TransactionItem } from "../../models/models";
import { useEffect, useState } from "react";
import { apiCall } from "../../utils/apiCall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import AddProductPage from "./AddProductPage";

interface Props {
  onPrevious: () => void;
  onNext: () => void;
  selectedProducts: TransactionItem[];
  changeSelectedProducts: (items: TransactionItem[]) => void;
  transaction: Transaction;
}

function SelectProduct({
  onPrevious,
  onNext,
  selectedProducts,
  changeSelectedProducts,
  transaction,
}: Props) {
  const [loaderShow, setLoaderShow] = useState(true);
  const [currentSelectedProducts, setCurrentSelectedProducts] =
    useState<TransactionItem[]>(selectedProducts);

  const [existingProducts, setExistingProducts] = useState<Product[]>([]);
  const [currentAlert, setCurrentAlert] = useState("");

  const [showSelectedProductsPage, setShowSelectedProductsPage] =
    useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiCall<Product[]>(
          "GET",
          "/products/get_all_products"
        );
        if (response.success && Array.isArray(response.data)) {
          setExistingProducts(
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
          setCurrentAlert(response.data["detail"]);
        }
        setLoaderShow(false);
      } catch (error) {
        setCurrentAlert("Check the console for errors");
        console.error("Error fetching products:", error);
        setLoaderShow(false);
      }
    };
    fetchProducts();
  }, []);

  const validate_products = () => {
    var currentTotal = 0;
    for (const transactionItem of currentSelectedProducts) {
      if (
        transactionItem.quantity !== undefined &&
        transactionItem.rate !== undefined
      ) {
        currentTotal += transactionItem.quantity * transactionItem.rate;
      }
      if (
        transactionItem.productId !== undefined &&
        transactionItem.productId === -1
      ) {
        transactionItem.name =
          transactionItem.name !== undefined ? transactionItem.name.trim() : "";
        if (transactionItem.name === "") {
          setCurrentAlert("Name of a product is empty");
          return false;
        }
      }
    }
    if (currentTotal != transaction.totalAmount) {
      setCurrentAlert("Total amount of the transaction doesn't add up");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validate_products()) {
      changeSelectedProducts(currentSelectedProducts);
      onNext();
    }
  };

  const handleAddProduct = () => {
    setShowSelectedProductsPage(false);
  };

  const selectedProductsTable = (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {currentSelectedProducts.map((transactionItem, index) => (
            <tr key={index}>
              <td>{transactionItem.name}</td>
              <td>{transactionItem.productType}</td>
              <td>{transactionItem.quantity}</td>
              <td>{transactionItem.rate}</td>
              <td>
                {transactionItem.quantity &&
                  transactionItem.rate &&
                  "$" +
                    (transactionItem.quantity &&
                      transactionItem.rate &&
                      (transactionItem.quantity * transactionItem.rate).toFixed(
                        2
                      ))}
              </td>
              <td>
                <FontAwesomeIcon
                  className="ms-auto"
                  icon={faTrash}
                  onClick={() => {
                    setCurrentSelectedProducts([
                      ...currentSelectedProducts.slice(0, index),
                      ...currentSelectedProducts.slice(index + 1),
                    ]);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const selectProductPage = (
    <>
      <h2 className="mt-2">Transaction</h2>
      <h6>Type: {transaction.buyOrSell}</h6>
      <h6>Total Amount: ${transaction.totalAmount}</h6>
      <h2 className="mt-4">Products</h2>
      {loaderShow && (
        <Spinner animation="border" className="mt-2">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!loaderShow && (
        <>
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
          {currentSelectedProducts.length > 0 && selectedProductsTable}
          {currentSelectedProducts.length == 0 && <h6>No products selected</h6>}
          <Form.Group className="mt-4">
            <div className="d-flex">
              <div className="me-auto">
                <Button variant="secondary" type="button" onClick={onPrevious}>
                  Back
                </Button>
              </div>
              <div className="ms-auto me-auto">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleAddProduct}
                >
                  Add Product
                </Button>
              </div>
              <div className="ms-auto">
                <Button variant="primary" type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          </Form.Group>
        </>
      )}
    </>
  );

  const addProductPage = (
    <AddProductPage
      products={existingProducts}
      selectedProductIds={currentSelectedProducts.map((transactionItem) =>
        transactionItem.productId ? transactionItem.productId : 0
      )}
      onCancel={() => {
        setShowSelectedProductsPage(true);
      }}
      addToSelected={(transactionItem: TransactionItem) => {
        setCurrentSelectedProducts([
          ...currentSelectedProducts,
          transactionItem,
        ]);
      }}
    ></AddProductPage>
  );

  return (
    <>
      {showSelectedProductsPage && selectProductPage}
      {!showSelectedProductsPage && addProductPage}
    </>
  );
}

export default SelectProduct;
