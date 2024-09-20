import { useEffect, useState } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Product } from "../../models/models";
import ViewProduct from "./ViewProduct";

// Inventory Component
function Inventory() {
  const [loaderShow, setLoaderShow] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
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
          setLoaderShow(false);
        } else if (
          typeof response.data === "object" &&
          "detail" in response.data
        ) {
          setAlertMessage(response.data["detail"]);
          setLoaderShow(false);
        }
      } catch (error) {
        setAlertMessage("Check console for errors");
        console.error("Error fetching products:", error);
        setLoaderShow(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product selection for deletion
  const handleSelect = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(
        selectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  // Handle deletion of selected products
  const handleDeactivate = async () => {
    setLoaderShow(true);
    try {
      const deactivateProducts: Product[] = [];
      selectedProducts.map((index: number) => {
        deactivateProducts.push(products[index]);
      });
      const response = await apiCall<Product[]>(
        "PUT",
        "/products/deactivate_products",
        deactivateProducts
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
      setSelectedProducts([]); // Reset selection
      setLoaderShow(false);
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error disabling products:", error);
      setLoaderShow(false);
    }
  };

  const [showAlert, setShowAlert] = useState(true);
  const alertMessageBox = (
    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
      {alertMessage}
    </Alert>
  );

  const [showProduct, setShowProduct] = useState(false);
  const [productToShow, setProductToShow] = useState(<></>);

  const handleProductClicked = (index: number) => {
    setProductToShow(
      <ViewProduct
        product={products[index]}
        handleCloseProduct={() => {
          setShowProduct(false);
          setProductToShow(<></>);
        }}
        backSign={true}
        updatable={true}
        updateFunction={(product: Product) => {
          setProducts(
            [
              ...products.slice(0, index),
              product,
              ...products.slice(index + 1),
            ].sort((a: Product, b: Product) => {
              if (a.quantity && b.quantity && a.quantity < b.quantity) {
                return 1;
              }
              return -1;
            })
          );
        }}
      ></ViewProduct>
    );
    setShowProduct(true);
  };

  const inventoryTable = (
    <>
      <p className="mb-2">
        Products not used in any transaction can be disabled.
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Disable</th>
            <th>Name</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Avg Rate</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(index)}
                  onChange={() => handleSelect(index)}
                  disabled={product.usedInTransaction != 0}
                />
              </td>
              <td onClick={() => handleProductClicked(index)}>
                {product.name}
              </td>
              <td onClick={() => handleProductClicked(index)}>
                {product.type}
              </td>
              <td onClick={() => handleProductClicked(index)}>
                {product.quantity}
              </td>
              <td onClick={() => handleProductClicked(index)}>
                {product.avgBuyRate}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  return (
    <div className="mt-2">
      {!showProduct && (
        <>
          <h2 className="mt-2">Inventory</h2>
          {loaderShow && (
            <Spinner animation="border" className="mt-2">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          {!loaderShow && (
            <>
              {showAlert && alertMessage !== "" && alertMessageBox}

              {products.length > 0 && inventoryTable}
              {products.length == 0 && (
                <h6 className="mt-2">No products here</h6>
              )}

              {selectedProducts.length > 0 && (
                <Button variant="danger" onClick={handleDeactivate}>
                  Disable Selected Products
                </Button>
              )}
            </>
          )}
        </>
      )}
      {showProduct && productToShow}
    </div>
  );
}

export default Inventory;
