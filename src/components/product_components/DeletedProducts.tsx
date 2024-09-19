import { useEffect, useState } from "react";
import { Table, Button, Alert, Stack } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Product } from "../../models/models";
import ViewProduct from "./ViewProduct";

function DeletedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [recoverSelectedProducts, setRecoverSelectedProducts] = useState<
    number[]
  >([]);
  const [alertMessage, setAlertMessage] = useState<string>("");

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiCall<Product[]>(
          "GET",
          "/products/get_deleted_products"
        );
        if (response.success && Array.isArray(response.data)) {
          setProducts(response.data);
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

  // Handle product selection for recovery
  const handleSelectRecover = (id: number) => {
    if (recoverSelectedProducts.includes(id)) {
      setRecoverSelectedProducts(
        recoverSelectedProducts.filter((productId) => productId !== id)
      );
    } else {
      setRecoverSelectedProducts([...recoverSelectedProducts, id]);
    }
  };

  // Handle deletion of selected products
  const handleDelete = async () => {
    try {
      const deleteProducts: Product[] = [];
      selectedProducts.map((index: number) => {
        deleteProducts.push(products[index]);
      });
      const response = await apiCall<Product[]>(
        "DELETE",
        "/products/delete_products",
        deleteProducts
      );
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
      setSelectedProducts([]); // Reset selection
      setRecoverSelectedProducts([]);
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error deleting products:", error);
    }
  };

  // Handle recover of selected products
  const handleRecover = async () => {
    try {
      const enableProducts: Product[] = [];
      recoverSelectedProducts.map((index: number) => {
        enableProducts.push(products[index]);
      });
      const response = await apiCall<Product[]>(
        "PUT",
        "/products/recover_products",
        enableProducts
      );
      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
      setSelectedProducts([]); // Reset selection
      setRecoverSelectedProducts([]);
    } catch (error) {
      setAlertMessage("Check console for errors");
      console.error("Error deleting products:", error);
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
      ></ViewProduct>
    );
    setShowProduct(true);
  };

  const disabledTable = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th style={{ width: "10%" }}>Recover</th>
          <th>Name</th>
          <th>Type</th>
          <th style={{ width: "10%" }}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product.id}>
            <td>
              <input
                type="checkbox"
                checked={recoverSelectedProducts.includes(index)}
                onChange={() => handleSelectRecover(index)}
              />
            </td>
            <td onClick={() => handleProductClicked(index)}>{product.name}</td>
            <td onClick={() => handleProductClicked(index)}>{product.type}</td>
            <td>
              <input
                type="checkbox"
                checked={selectedProducts.includes(index)}
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
      {!showProduct && (
        <>
          <h2 className="mt-2">Disabled Products</h2>
          {showAlert && alertMessage !== "" && alertMessageBox}

          {products.length > 0 && disabledTable}
          {products.length == 0 && <h6 className="mt-2">No products here</h6>}

          <Stack direction="horizontal" gap={2}>
            {recoverSelectedProducts.length > 0 && (
              <div>
                <Button variant="primary" onClick={handleRecover}>
                  Enable Selected Products
                </Button>
              </div>
            )}
            {selectedProducts.length > 0 && (
              <div className="ms-auto">
                <Button variant="danger" onClick={handleDelete}>
                  Permanently Delete Selected Products
                </Button>
              </div>
            )}
          </Stack>
        </>
      )}
      {showProduct && productToShow}
    </div>
  );
}

export default DeletedProducts;
